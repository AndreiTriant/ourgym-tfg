<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250506155032 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion_comentario DROP FOREIGN KEY FK_EBFC2B3FF3F2D7EC
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion_comentario ADD CONSTRAINT FK_EBFC2B3FF3F2D7EC FOREIGN KEY (comentario_id) REFERENCES comentario (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion_comentario DROP FOREIGN KEY FK_EBFC2B3FF3F2D7EC
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE reaccion_comentario ADD CONSTRAINT FK_EBFC2B3FF3F2D7EC FOREIGN KEY (comentario_id) REFERENCES comentario (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        SQL);
    }
}
