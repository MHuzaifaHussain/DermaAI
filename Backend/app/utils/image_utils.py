import cv2
import numpy as np


def preprocess_image(image_bytes: bytes) -> np.ndarray:

    image_array = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    resized_img = cv2.resize(img_rgb, (224, 224))
    scaled_img = resized_img / 255.0
    preprocessed_img = np.expand_dims(scaled_img, axis=0)

    return preprocessed_img
