import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }
}