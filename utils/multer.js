import { nanoid } from "nanoid"
import multer from "multer"

export const multerValidation = {
    image: ["image/jpeg", "image/png"],
    pdf: ["application/pdf"]
}

export const myMulter = (customValidation) => {
    if (!customValidation) {
        customValidation = multerValidation.image
    }

    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("inValid format", false)
        }
    }

    const upload = multer({ fileFilter, storage })
    return upload;
}