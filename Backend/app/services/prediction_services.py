from fastapi import UploadFile, HTTPException
from pymongo.database import Database
from datetime import datetime
import numpy as np
from tensorflow import keras
import tensorflow_hub as hub
from app.utils.image_utils import preprocess_image
from app.utils.cloudinary_helper import upload_to_cloudinary
from app.models.schema import PredictionHistory

# Recreate the model architecture and load only the weights
feature_extractor_url = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/feature_vector/4"
feature_extractor_layer = hub.KerasLayer(
    feature_extractor_url,
    input_shape=(224, 224, 3),
    trainable=False
)

model = keras.Sequential([
    feature_extractor_layer,
    keras.layers.Dense(8, activation='softmax')
])

model.load_weights("models/my_model_weights.h5")

CLASS_NAMES = [
    'Cellulitis', 'Impetigo', 'Athlete Foot', 'Nail Fungus',
    'Ringworm', 'Cutaneous Larva Migrans', 'Chickenpox', 'Shingles'
]


async def predict_and_save(
    file: UploadFile,
    db: Database,
    user_id: int = None
):
    """
    Preprocesses an image, gets a prediction from the model,
    uploads the image to Cloudinary, and saves the result to the database if a user is logged in.
    """
    image_bytes = await file.read()
    preprocessed_image = preprocess_image(image_bytes)
    prediction = model.predict(preprocessed_image)
    predicted_class_index = np.argmax(prediction)
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    confidence = np.max(prediction) * 100

    try:
        image_url = upload_to_cloudinary(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to upload image: {str(e)}")

    if user_id:
        try:
            sequence_doc = await db.counters.find_one_and_update(
                {'_id': 'history_id'},
                {'$inc': {'sequence_value': 1}},
                upsert=True,
                return_document=True
            )
            history_id = sequence_doc['sequence_value']

            history_entry = PredictionHistory(
                _id=history_id,
                user_id=user_id,
                disease=predicted_class_name,
                confidence=confidence,
                image_url=image_url,
                timestamp=datetime.utcnow()
            )
            await db.history.insert_one(history_entry.dict(by_alias=True))
        except Exception as e:
            print(f"Error saving history: {str(e)}")

    return {
        "disease": predicted_class_name,
        "confidence": confidence,
        "image_url": image_url
    }
