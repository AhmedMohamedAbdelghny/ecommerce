import { nanoid } from "nanoid"
import multer from "multer"
import path from "path"
import fs from "fs"
export const multerValidation = {
    image: ["image/jpeg", "image/png"],
    pdf: ["application/pdf"]
}

export const myMulterLocal = (customValidation, customPath) => {
    const destPath = path.resolve(`uploads/${customPath}`)
    if (!customValidation) {
        customValidation = multerValidation.image
    }
    if (!customPath) {
        customPath = "general"
    }
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destPath)
        },
        filename: function (req, file, cb) {
            const uniqueFileName = nanoid() + file.originalname
            cb(null, uniqueFileName)
        }
    })

    // const storage = multer.diskStorage({})
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