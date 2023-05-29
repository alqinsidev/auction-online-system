import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBidItemTable1684971313374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bid_item',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
            isUnique: true,
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'winner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'start_price',
            type: 'numeric',
          },
          {
            name: 'last_price',
            type: 'numeric',
          },
          {
            name: 'time_window',
            type: 'int',
          },
          {
            name: 'start_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'isDraft',
            type: 'boolean',
            default: true,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('bid_item', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['winner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('bid_item');
    const foreignKey = (column: 'user_id' | 'winner_id') =>
      table.foreignKeys.find((fk) => fk.columnNames.indexOf(column) !== -1);
    await queryRunner.dropForeignKey('bid_item', foreignKey('user_id'));
    await queryRunner.dropForeignKey('bid_item', foreignKey('winner_id'));
    await queryRunner.dropTable('bid_item');
  }
}
