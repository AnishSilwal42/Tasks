import multer from "@koa/multer";

const storage = multer.diskStorage({

    destination: "uploads/",

    filename: function (req, file, cb) {

        const filename =
            Date.now() + "-" + file.originalname;

        cb(null, filename);
    }

});

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG and WebP images are allowed"));
        }
    }

});

export default upload;