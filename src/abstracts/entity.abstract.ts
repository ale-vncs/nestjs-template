import { BeforeUpdate, Column } from 'typeorm';

export abstract class EntityAbstract {
  @Column({
    type: 'timestamptz',
  })
  createdAt = new Date();

  @Column({
    type: 'timestamptz',
  })
  updatedAt = new Date();

  @BeforeUpdate()
  private beforeUpdateEntity() {
    this.updatedAt = new Date();
  }
}
