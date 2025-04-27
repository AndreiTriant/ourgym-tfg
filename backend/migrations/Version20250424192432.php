<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250424192432 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE comentario (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, publicacion_id INT NOT NULL, contenido LONGTEXT NOT NULL, fecha DATETIME NOT NULL, INDEX IDX_4B91E702DB38439E (usuario_id), INDEX IDX_4B91E7029ACBB5E7 (publicacion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE comentario_rutina (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, rutina_id INT NOT NULL, contenido LONGTEXT NOT NULL, fecha DATETIME NOT NULL, INDEX IDX_6114BE59DB38439E (usuario_id), INDEX IDX_6114BE59D7A88FCB (rutina_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ejercicio (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(100) NOT NULL, descripcion LONGTEXT DEFAULT NULL, imagen VARCHAR(255) DEFAULT NULL, video VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ejercicio_rutina (id INT AUTO_INCREMENT NOT NULL, rutina_id INT NOT NULL, ejercicio_id INT NOT NULL, series INT NOT NULL, repeticiones INT NOT NULL, descanso VARCHAR(50) DEFAULT NULL, INDEX IDX_2F1FADCCD7A88FCB (rutina_id), INDEX IDX_2F1FADCC30890A7D (ejercicio_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE favorito (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, publicacion_id INT DEFAULT NULL, rutina_id INT DEFAULT NULL, INDEX IDX_881067C7DB38439E (usuario_id), INDEX IDX_881067C79ACBB5E7 (publicacion_id), INDEX IDX_881067C7D7A88FCB (rutina_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE mensaje_privado (id INT AUTO_INCREMENT NOT NULL, emisor_id INT NOT NULL, receptor_id INT NOT NULL, contenido LONGTEXT NOT NULL, fecha DATETIME NOT NULL, leido TINYINT(1) NOT NULL, INDEX IDX_EE4C4D866BDF87DF (emisor_id), INDEX IDX_EE4C4D86386D8D01 (receptor_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notificacion (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, mensaje VARCHAR(255) NOT NULL, fecha DATETIME NOT NULL, leida TINYINT(1) NOT NULL, INDEX IDX_729A19ECDB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE progreso (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, nombre_ejercicio VARCHAR(100) NOT NULL, fecha DATETIME NOT NULL, peso DOUBLE PRECISION NOT NULL, repeticiones INT NOT NULL, series INT NOT NULL, INDEX IDX_3600AE09DB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE publicacion (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, imagen VARCHAR(255) DEFAULT NULL, descripcion VARCHAR(500) NOT NULL, fecha DATETIME NOT NULL, tipo VARCHAR(255) NOT NULL, INDEX IDX_62F2085FDB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE reaccion (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, publicacion_id INT NOT NULL, tipo VARCHAR(255) NOT NULL, INDEX IDX_691968D1DB38439E (usuario_id), INDEX IDX_691968D19ACBB5E7 (publicacion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rutina (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, nombre VARCHAR(100) NOT NULL, descripcion LONGTEXT DEFAULT NULL, fecha_creacion DATETIME NOT NULL, INDEX IDX_A48AB255DB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE seguimiento (id INT AUTO_INCREMENT NOT NULL, seguidor_id INT NOT NULL, seguido_id INT NOT NULL, fecha DATETIME NOT NULL, INDEX IDX_1B2181D2924E960 (seguidor_id), INDEX IDX_1B2181D3572B040 (seguido_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, nom_usu VARCHAR(20) NOT NULL, email VARCHAR(100) NOT NULL, contrasenya VARCHAR(255) NOT NULL, tipo_usu VARCHAR(255) NOT NULL, fecha_creacion DATETIME NOT NULL, descripcion LONGTEXT DEFAULT NULL, foto_perfil VARCHAR(255) DEFAULT NULL, ult_conexion DATETIME DEFAULT NULL, verificado TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E702DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E7029ACBB5E7 FOREIGN KEY (publicacion_id) REFERENCES publicacion (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario_rutina ADD CONSTRAINT FK_6114BE59DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario_rutina ADD CONSTRAINT FK_6114BE59D7A88FCB FOREIGN KEY (rutina_id) REFERENCES rutina (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ejercicio_rutina ADD CONSTRAINT FK_2F1FADCCD7A88FCB FOREIGN KEY (rutina_id) REFERENCES rutina (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ejercicio_rutina ADD CONSTRAINT FK_2F1FADCC30890A7D FOREIGN KEY (ejercicio_id) REFERENCES ejercicio (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito ADD CONSTRAINT FK_881067C7DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito ADD CONSTRAINT FK_881067C79ACBB5E7 FOREIGN KEY (publicacion_id) REFERENCES publicacion (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito ADD CONSTRAINT FK_881067C7D7A88FCB FOREIGN KEY (rutina_id) REFERENCES rutina (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE mensaje_privado ADD CONSTRAINT FK_EE4C4D866BDF87DF FOREIGN KEY (emisor_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE mensaje_privado ADD CONSTRAINT FK_EE4C4D86386D8D01 FOREIGN KEY (receptor_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notificacion ADD CONSTRAINT FK_729A19ECDB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE progreso ADD CONSTRAINT FK_3600AE09DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE publicacion ADD CONSTRAINT FK_62F2085FDB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion ADD CONSTRAINT FK_691968D1DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion ADD CONSTRAINT FK_691968D19ACBB5E7 FOREIGN KEY (publicacion_id) REFERENCES publicacion (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rutina ADD CONSTRAINT FK_A48AB255DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE seguimiento ADD CONSTRAINT FK_1B2181D2924E960 FOREIGN KEY (seguidor_id) REFERENCES usuario (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE seguimiento ADD CONSTRAINT FK_1B2181D3572B040 FOREIGN KEY (seguido_id) REFERENCES usuario (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E702DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E7029ACBB5E7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario_rutina DROP FOREIGN KEY FK_6114BE59DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario_rutina DROP FOREIGN KEY FK_6114BE59D7A88FCB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ejercicio_rutina DROP FOREIGN KEY FK_2F1FADCCD7A88FCB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ejercicio_rutina DROP FOREIGN KEY FK_2F1FADCC30890A7D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito DROP FOREIGN KEY FK_881067C7DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito DROP FOREIGN KEY FK_881067C79ACBB5E7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE favorito DROP FOREIGN KEY FK_881067C7D7A88FCB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE mensaje_privado DROP FOREIGN KEY FK_EE4C4D866BDF87DF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE mensaje_privado DROP FOREIGN KEY FK_EE4C4D86386D8D01
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notificacion DROP FOREIGN KEY FK_729A19ECDB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE progreso DROP FOREIGN KEY FK_3600AE09DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE publicacion DROP FOREIGN KEY FK_62F2085FDB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion DROP FOREIGN KEY FK_691968D1DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion DROP FOREIGN KEY FK_691968D19ACBB5E7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rutina DROP FOREIGN KEY FK_A48AB255DB38439E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE seguimiento DROP FOREIGN KEY FK_1B2181D2924E960
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE seguimiento DROP FOREIGN KEY FK_1B2181D3572B040
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE comentario
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE comentario_rutina
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ejercicio
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ejercicio_rutina
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE favorito
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE mensaje_privado
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notificacion
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE progreso
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE publicacion
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE reaccion
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rutina
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE seguimiento
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE usuario
        SQL);
    }
}
