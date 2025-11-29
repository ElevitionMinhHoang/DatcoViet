import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(createContactDto: CreateContactDto) {
    const { name, email, message } = createContactDto;
    
    return this.prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });
  }
}