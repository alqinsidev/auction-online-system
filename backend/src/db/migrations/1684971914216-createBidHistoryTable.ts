import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBidHistoryTable1684971914216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bid_history',
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
            name: 'bid_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'bid_amount',
            type: 'numeric',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('bid_history', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['bid_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bid_item',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('bid_history');
    const foreignKey = (column: 'user_id' | 'bid_id') =>
      table.foreignKeys.find((fk) => fk.columnNames.indexOf(column) !== -1);
    await queryRunner.dropForeignKey('bid_history', foreignKey('bid_id'));
    await queryRunner.dropForeignKey('bid_history', foreignKey('user_id'));
    await queryRunner.dropTable('bid_history');
  }
}
