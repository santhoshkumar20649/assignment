import { Entity, PrimaryColumn, Column,BaseEntity } from 'typeorm';


@Entity('feed')
export class Feed extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({nullable:false})
  name: string;

  @Column()
  url: string;

  @Column({nullable:true})
  role: string;

  @Column({nullable:true})
  description: string;

  @Column({nullable:true})
  createdAt: Date;

  @Column({nullable:true})
  updatedAt: Date;
}