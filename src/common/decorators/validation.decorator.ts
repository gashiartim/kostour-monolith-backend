/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { compare } from 'bcryptjs';
import { getManager } from 'typeorm';
import * as moment from 'moment';
import * as contextService from 'request-context';

export function SameAs(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'SameAs',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value === relatedValue;
        },
      },
    });
  };
}

export function IsDateBeforeToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateBeforeToday',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            moment(value, 'DD/MM/YYYY', true).isBefore(moment()) &&
            moment(value, 'DD/MM/YYYY', true).isValid()
          );
        },
      },
    });
  };
}

export function IsDateValide(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateBeforeToday',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return moment(value, 'DD/MM/YYYY', true).isValid();
        },
      },
    });
  };
}

export function PriceObject(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PriceObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value === relatedValue;
        },
      },
    });
  };
}

export function IsNotEmptyObject(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PriceObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value == 'object') {
            return value && Object.keys(value).length;
          }
          return value && value.length;
        },
      },
    });
  };
}

export function DifferentFrom(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'DifferentFrom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value != relatedValue;
        },
      },
    });
  };
}

@ValidatorConstraint({ async: true })
export class OldPasswordConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const currentUser = contextService.get('request:user');

    if (!currentUser.password_set) {
      return !currentUser.password_set;
    }

    return await compare(value, currentUser.password);
  }
}

export function OldPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'OldPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: OldPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(fieldValue: any, args: ValidationArguments) {
    const request = contextService.get('request');
    const entity = args.constraints[0];
    const except = args.constraints[2] || {};
    let table = args.constraints[1];
    let column =
      request.body && request.body.lang != 'se'
        ? args.property
        : args.property + '_se';
    const relatedValues = args.object as any;
    let ignoreValue = '';

    if (except.param_field) {
      ignoreValue = request.params[except.param_field];
    } else if (except.body_field) {
      ignoreValue = relatedValues[except.body_field];
    } else if (except.except_value == ':current_user_id') {
      ignoreValue = request.user.id;
    } else if (except.except_value) {
      ignoreValue = except.except_value;
    }

    if (table.indexOf('.') > 0) {
      const [table_name, table_prop] = table.split('.');
      table = table_name;
      column = table_prop;
    }

    let query = await getManager()
      .createQueryBuilder(entity, table)
      .where(table + '.' + column + ' = :value', { value: fieldValue });

    if (ignoreValue && except.field) {
      query = query.andWhere(table + '.' + except.field + ' != :ignoreValue', {
        ignoreValue: ignoreValue,
      });
    }

    return (await query.getOne()) == undefined;
  }
}

export function IsUnique(
  entity: string,
  table: string,
  except?: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    validationOptions = validationOptions ? validationOptions : {};

    if (!validationOptions.message) {
      validationOptions.message =
        'Entity with that "' +
        propertyName +
        '" already exists in "' +
        table +
        '"';
    }

    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity, table, except],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class NotExistsConstraint implements ValidatorConstraintInterface {
  async validate(fieldValue: any, args: ValidationArguments) {
    const request = contextService.get('request');
    const entity = args.constraints[0];
    const table = args.constraints[1];
    const field = args.constraints[2] || {};

    const relatedValues = args.object as any;

    const query = await getManager()
      .createQueryBuilder(entity, table)
      .where(table + '.' + field.field + ' = :value', {
        value: relatedValues[field.body_field],
      });

    return (await query.getOne()) == undefined;
  }
}

export function NotExists(
  entity: string,
  table: string,
  except?: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    validationOptions = validationOptions ? validationOptions : {};

    if (!validationOptions.message) {
      validationOptions.message =
        'Entity with that "' +
        propertyName +
        '" doesn\'t exists in "' +
        table +
        '"';
    }

    registerDecorator({
      name: 'NotExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity, table, except],
      options: validationOptions,
      validator: NotExistsConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  async validate(fieldValue: any, args: ValidationArguments) {
    const request = contextService.get('request');
    const entity = args.constraints[0];
    const table = args.constraints[1];
    const field = args.constraints[2] || {};

    const relatedValues = args.object as any;

    let value = '';

    if (field.param_field) {
      value = request.params[field.param_field];
    } else {
      value = relatedValues[field.body_field];
    }

    const query = await getManager()
      .createQueryBuilder(entity, table)
      .where(table + '.' + field.field + ' = :value', { value });

    return (await query.getOne()) != undefined;
  }
}

export function Exists(
  entity: string,
  table: string,
  except?: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    validationOptions = validationOptions ? validationOptions : {};

    if (!validationOptions.message) {
      validationOptions.message =
        'Entity with that "' +
        propertyName +
        '" doesn\'t exists in "' +
        table +
        '"';
    }

    registerDecorator({
      name: 'Exists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity, table, except],
      options: validationOptions,
      validator: ExistsConstraint,
    });
  };
}
