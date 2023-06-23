import { Entity, PrimaryColumn, Column,BaseEntity} from 'typeorm';


@Entity('feedaccess')
export class FeedAccess extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    feedId: string;

    @Column()
    userId: string;

    @Column({default: null, nullable: true})
    hasDeleteAccess: Boolean;

    @Column({default: null, nullable: true})
    hasAccess: Boolean;
    
    @Column({nullable:true})
    createdAt: Date;

    @Column({nullable:true})
    updatedAt: Date;
}