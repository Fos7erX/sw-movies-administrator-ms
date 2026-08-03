import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

//Nota de documentación: Voy a trabajar con 2 entidades. Una de usuarios y otra de películas. De este modo se van a poder agregar y/o modificar nuevas películas en el proyecto.
@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true })
  externalId?: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  openingCrawl?: string;

  @Column({ nullable: true })
  episodeId?: string;

  @Column({ nullable: true })
  swapiUrl?: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true })
  producer?: string;

  @Column({ nullable: true })
  releaseDate?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
