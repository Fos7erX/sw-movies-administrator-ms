import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//Nota de documentación:
// Por qué separar así los roles? En este caso considero mejor separarlo con una columna especifica en la misma tabla, en vez de crear una tabla nueva, debido a cuestiones de simpleza y prolijidad. Si creo una nueva tabla para usuarios root, teniendo en cuenta que tienen las mismas propiedades, estaría complicando de más la lógica y estructura de la base de datos. Además, de esta forma se respetan los principios de normailzación de tablas, ya que se evita la duplicidad de columnas y se simplifica a la mínima expresión la cantidad de datos.
export enum UserRole { 
    USER='user',
    ADMIN='admin',
}


@Entity('users')
export class User{
    
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({unique:true})
    email!:string;

    @Column()
    name!:string;

    @Column({select:false}) //Acá seteo select en false para que no se devuelva nunca la contraseña en consultas
    password!:string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!:Date;

    @Column({
        type:'enum',
        enum:UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;
    
}