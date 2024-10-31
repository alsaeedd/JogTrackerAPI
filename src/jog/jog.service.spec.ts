import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JogService } from "./jog.service";
import { Jog } from "./schemas/jog.schema";
import mongoose, { Model } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { NotFoundException } from "@nestjs/common";
import { CreateJogDto } from "./dto/create-jog.dto";

describe('JogService', () => {
    let jogService: JogService;
    let model: Model<Jog>;
    
    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'Mohammed',
        email: 'mohammed@gmail.com',
      };
    

    const mockJogService = {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    const mockJog = {
        _id: '1',
        time: 1,
        distance: 1,
        date: new Date(),
        location: {
            lat: 1,
            lon: 1,
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JogService, 
            {
                provide: getModelToken(Jog.name),
                useValue: mockJogService,
            },
        ]
        }).compile();

        jogService = module.get<JogService>(JogService);
        model = module.get<Model<Jog>>(getModelToken(Jog.name));
      });

      //findById
      describe('findById', () => {
      
        it('should find and return a jog by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockJog);

            const result = await jogService.findById(mockJog._id);

            expect(model.findById).toHaveBeenCalledWith(mockJog._id); 
            expect(result).toEqual(mockJog);
        })

        it('should throw NotFoundException if the jog is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null);
      
            await expect(jogService.findById(mockJog._id)).rejects.toThrow(
              NotFoundException,
            );
      
            expect(model.findById).toHaveBeenCalledWith(mockJog._id);
          });

    })

    //create
    describe('create', () => {
        it('should create and return a jog', async () => {
          const newJog = {
            time: 1,
            distance: 1,
            date: new Date(),
            location: {
                lat: 1,
                lon: 1,
            },
          };
    
          jest
            .spyOn(model, 'create')
            .mockImplementationOnce(() => Promise.resolve(mockJog as any));
    
          const result = await jogService.create(
            newJog as CreateJogDto,
            mockUser as User,
          );
    
          expect(result).toEqual(mockJog);
        });
    });

    describe('findAll', () => {     
        it('should return paginated array of jogs', async () => {
            const mockJogs = [mockJog];
            const query = { page: '2' };
            const mockPaginatedFind = {
                find: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockJogs)
            };

            jest.spyOn(model, 'find').mockImplementation(() => mockPaginatedFind as any);

            const result = await jogService.findAll(query);

            expect(mockPaginatedFind.skip).toHaveBeenCalledWith(2); 
            expect(mockPaginatedFind.limit).toHaveBeenCalledWith(2);
            expect(result).toEqual(mockJogs);
        });

        it('should use default page 1 when no page specified', async () => {
            const mockJogs = [mockJog];
            const query = {};
            const mockPaginatedFind = {
                find: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockJogs)
            };

            jest.spyOn(model, 'find').mockImplementation(() => mockPaginatedFind as any);

            const result = await jogService.findAll(query);

            expect(mockPaginatedFind.skip).toHaveBeenCalledWith(0); // resultsPerPage(2) * (page(1) - 1)
            expect(mockPaginatedFind.limit).toHaveBeenCalledWith(2);
            expect(result).toEqual(mockJogs);
        });
    });

      
})