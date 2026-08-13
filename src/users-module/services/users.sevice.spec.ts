import { UsersService } from './users.sevice';
import { User } from '../../database-module/entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  const mockRepository: any = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockQueryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    usersService = new UsersService(mockRepository as any);
  });

  it('should find a user by email', async () => {
    const expectedUser = { id: 1, email: 'test@example.com', password: 'hash' } as User;
    mockQueryBuilder.getOne.mockResolvedValue(expectedUser);

    const result = await usersService.findByEmail('test@example.com');

    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
      email: 'test@example.com',
    });
    expect(result).toEqual(expectedUser);
  });

  it('should create and save a new user', async () => {
    const userDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed-pass',
      role: 'user',
    } as any;
    const createdUser = { id: 2, ...userDto } as User;
    mockRepository.create.mockReturnValue(userDto);
    mockRepository.save.mockResolvedValue(createdUser);

    const result = await usersService.create(userDto);

    expect(mockRepository.create).toHaveBeenCalledWith(userDto);
    expect(mockRepository.save).toHaveBeenCalledWith(userDto);
    expect(result).toEqual(createdUser);
  });
});
