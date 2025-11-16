import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Esto es para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // carpeta donde se guardarán las imágenes
    cb(null, path.join(__dirname, "../../public/Imagenes"));
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// Filtro opcional para restringir tipos de archivos
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Formato de imagen no soportado"), false);
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
