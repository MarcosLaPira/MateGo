-- MateGo

-- Crear BD y usarla
CREATE DATABASE IF NOT EXISTS MateGo
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE MateGo;

-- aseguramos InnoDB y FKs habilitadas
SET default_storage_engine = InnoDB;
SET FOREIGN_KEY_CHECKS = 1;


-- CategoriaProducto
-- unica por descripcion

CREATE TABLE IF NOT EXISTS CategoriaProducto (
  idCategoriaProducto INT UNSIGNED NOT NULL AUTO_INCREMENT,
  descripcion         VARCHAR(100) NOT NULL,
  PRIMARY KEY (idCategoriaProducto),
  UNIQUE KEY uq_categoria_descripcion (descripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- UsuarioAdministrador
-- ==========================================
CREATE TABLE IF NOT EXISTS UsuarioAdministrador (
  idUsuarioAdministrador INT UNSIGNED NOT NULL AUTO_INCREMENT,
  correo                 VARCHAR(100) NOT NULL,
  contrasenaHash         VARCHAR(255) NOT NULL,
  ultimoIngreso          DATETIME NULL,
  PRIMARY KEY (idUsuarioAdministrador),
  UNIQUE KEY uq_usuarioadmin_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Producto
-- fechaActualizacion se actualiza automáticamente en UPDATE.
-- ==========================================
CREATE TABLE IF NOT EXISTS Producto (
  idProducto            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre                VARCHAR(100) NOT NULL,
  idCategoriaProducto   INT UNSIGNED NOT NULL,
  precio                DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock                 INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen                VARCHAR(255),
  activo                TINYINT(1) NOT NULL DEFAULT 1, -- 1 = activo, 0 = baja lógica
  fechaCreacion         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idProducto),
  KEY idx_producto_categoria (idCategoriaProducto),
  KEY idx_producto_activo (activo),
  UNIQUE KEY uq_producto_nombre_categoria (nombre, idCategoriaProducto),
  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (idCategoriaProducto)
    REFERENCES CategoriaProducto (idCategoriaProducto)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Venta
-- Compra presencial: guardamos nombre del cliente y total.
-- ==========================================
CREATE TABLE IF NOT EXISTS Venta (
  idVenta        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombreCliente  VARCHAR(100) NOT NULL,
  fecha          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total          DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  PRIMARY KEY (idVenta),
  KEY idx_venta_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA: DetalleVenta (M:N Venta-Producto)
-- Precio unitario histórico + cantidad.
-- ==========================================
CREATE TABLE IF NOT EXISTS DetalleVenta (
  idDetalleVenta INT UNSIGNED NOT NULL AUTO_INCREMENT,
  idVenta        INT UNSIGNED NOT NULL,
  idProducto     INT UNSIGNED NOT NULL,
  cantidad       INT NOT NULL CHECK (cantidad >= 1),
  precioUnitario DECIMAL(10,2) NOT NULL CHECK (precioUnitario >= 0),
  PRIMARY KEY (idDetalleVenta),
  KEY idx_detalleventa_venta (idVenta),
  KEY idx_detalleventa_producto (idProducto),
  CONSTRAINT fk_detalleventa_venta
    FOREIGN KEY (idVenta)
    REFERENCES Venta (idVenta)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT fk_detalleventa_producto
    FOREIGN KEY (idProducto)
    REFERENCES Producto (idProducto)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

 CREATE TABLE IF NOT EXISTS EncuestaPostCompra (
   idEncuesta    INT UNSIGNED NOT NULL AUTO_INCREMENT,
   idVenta       INT UNSIGNED NOT NULL,
   calificacion  TINYINT UNSIGNED NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
   comentario    VARCHAR(500) NULL,
   fecha         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (idEncuesta),
   KEY idx_encuesta_venta (idVenta),
  CONSTRAINT fk_encuesta_venta
     FOREIGN KEY (idVenta)
     REFERENCES Venta (idVenta)
     ON UPDATE RESTRICT
     ON DELETE RESTRICT
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- SEED BÁSICO
-- ==========================================================

-- Categorías mínimas (requisito: al menos 2)
INSERT INTO CategoriaProducto (descripcion) VALUES
  ('Mates'), ('Yerbas'), ('Accesorios')
;


INSERT INTO UsuarioAdministrador (correo, contrasenaHash)
VALUES ('admin@matego.local', '$2b$10$REEMPLAZAR_ESTE_HASH_POR_EL_REAL_BCRYPT')
ON DUPLICATE KEY UPDATE contrasenaHash = VALUES(contrasenaHash);

-- Productos (IDs de categoría con subqueries para no depender del orden)
INSERT INTO Producto (nombre, idCategoriaProducto, precio, stock, imagen, activo)
VALUES
  ('Mate Imperial de Calabaza',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Mates'),
    18900, 15, 'mate_imperial.jpg', 1),
  ('Mate Camionero Premium',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Mates'),
    15900, 20, 'mate_camionero.jpg', 1),
  ('Yerba Playadito 1kg',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Yerbas'),
    5800, 30, 'yerba_playadito.jpg', 1),
  ('Yerba Canarias 1kg',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Yerbas'),
    7200, 25, 'yerba_canarias.jpg', 1),
  ('Bombilla Acero Inoxidable',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Accesorios'),
    3200, 40, 'bombilla_inox.jpg', 1),
  ('Yerbera + Azucarera (Set)',
    (SELECT idCategoriaProducto FROM CategoriaProducto WHERE descripcion = 'Accesorios'),
    9500, 10, 'set_yerbera_azucarera.jpg', 1)
;

-- Venta de ejemplo
INSERT INTO Venta (nombreCliente, total)
VALUES ('Cliente Piloto', 24700);

-- Detalle: 1 mate imperial + 1 yerba (tomando IDs por nombre/categoría)
INSERT INTO DetalleVenta (idVenta, idProducto, cantidad, precioUnitario)
VALUES
(
  (SELECT idVenta FROM Venta ORDER BY idVenta DESC LIMIT 1),
  (SELECT p.idProducto
     FROM Producto p
     JOIN CategoriaProducto c ON c.idCategoriaProducto = p.idCategoriaProducto
    WHERE p.nombre = 'Mate Imperial de Calabaza' AND c.descripcion = 'Mates'
    LIMIT 1),
  1,
  (SELECT p.precio
     FROM Producto p
     JOIN CategoriaProducto c ON c.idCategoriaProducto = p.idCategoriaProducto
    WHERE p.nombre = 'Mate Imperial de Calabaza' AND c.descripcion = 'Mates'
    LIMIT 1)
),
(
  (SELECT idVenta FROM Venta ORDER BY idVenta DESC LIMIT 1),
  (SELECT p.idProducto
     FROM Producto p
     JOIN CategoriaProducto c ON c.idCategoriaProducto = p.idCategoriaProducto
    WHERE p.nombre = 'Yerba Playadito 1kg' AND c.descripcion = 'Yerbas'
    LIMIT 1),
  1,
  (SELECT p.precio
     FROM Producto p
     JOIN CategoriaProducto c ON c.idCategoriaProducto = p.idCategoriaProducto
    WHERE p.nombre = 'Yerba Playadito 1kg' AND c.descripcion = 'Yerbas'
    LIMIT 1)
);
