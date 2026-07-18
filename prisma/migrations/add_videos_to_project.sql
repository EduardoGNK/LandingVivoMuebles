-- ============================================================
-- Migración: Añadir columna "videos" a la tabla Project
-- Aplica este SQL en tu panel MySQL (CPanel, phpMyAdmin, etc.)
-- ============================================================

ALTER TABLE `Project`
ADD COLUMN `videos` JSON NOT NULL DEFAULT (JSON_ARRAY())
AFTER `gallery`;

-- Verificar que la columna fue añadida correctamente:
-- DESCRIBE Project;
