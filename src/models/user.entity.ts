import { Entity, PrimaryGeneratedColumn, Column,BaseEntity,PrimaryColumn, Repository, EntityRepository } from 'typeorm';


@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({nullable:false})
  name: string;

  @Column()
  email: string;

  @Column({nullable:true})
  role: string;

  @Column({nullable:true})
  password: string;

  @Column({nullable:true})
  createdAt: Date;

  @Column({nullable:true})
  updatedAt: Date;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {


}