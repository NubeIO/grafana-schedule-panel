import { v4 as uuidv4 } from 'uuid';
import { ScheduleName } from './scheduleName.model';

export function create(name: string, inputValue = ''): ScheduleName {
  return {
    id: uuidv4(),
    name,
    inputValue,
  };
}
