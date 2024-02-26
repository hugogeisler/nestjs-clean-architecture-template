import { IUUID } from '@domain/adapters/uuid.interface';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UuidService implements IUUID {
    /**
     * Generate a new UUID for the entity
     */
    generate(): string {
        return new ObjectId().toString();
    }

    /**
     * Validate the UUID
     */
    validate(uuid: string): boolean {
        return ObjectId.isValid(uuid);
    }
}
