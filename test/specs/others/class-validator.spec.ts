import {
  IsBooleanEx,
  IsClassEx,
  IsDateEx,
  IsNumberEx,
  IsTsEnumEx,
} from '@decorators/validators';
import { RoleEnum } from '@enums/role.enum';
import { Undefined } from '@typings/generic.typing';
import { plainToInstance } from 'class-transformer';
import { IsOptional, IsString, validateSync } from 'class-validator';

describe('ClassValidator', () => {
  it('Deve validar todos os tipos com sucesso', () => {
    const data = {
      // Primitivo
      data: new Date().toISOString(),
      verdade: true,
      palavra: 'Mundo',
      numeroComoPalavra: '0145',
      numeroDecimal: 0.14,
      numeroInteiro: 14,
      enumQualquer: RoleEnum.ADMINISTRATOR,
      // Primitivo Opcional
      palavraOp: undefined,
      numeroOp: undefined,
      enumQualquerOp: undefined,
    };

    const obj = {
      ...data,
      validaFilho: data,
      validaFilhoOp: undefined,
      listaValidaFilho: [data],
    };

    const classe = plainToInstance(ValidaGeral, obj);
    const errors = validateSync(classe);

    expect(errors).toStrictEqual([]);
  });

  abstract class ValidacaoComun {
    // Primitivos
    @IsDateEx()
    data!: Date;

    @IsBooleanEx()
    verdade!: boolean;

    @IsString()
    palavra!: string;

    @IsString()
    numeroComoPalavra!: string;

    @IsNumberEx()
    numeroDecimal!: number;

    @IsNumberEx()
    numeroInteiro!: number;

    @IsTsEnumEx(RoleEnum)
    enumQualquer!: RoleEnum;

    // Primitivos opcionais
    @IsOptional()
    @IsString()
    palavraOp: Undefined<string>;

    @IsOptional()
    @IsNumberEx()
    numeroOp: Undefined<number>;

    @IsOptional()
    @IsTsEnumEx(RoleEnum)
    enumQualquerOp: Undefined<RoleEnum>;
  }

  class ValidaFilho extends ValidacaoComun {}

  class ValidaGeral extends ValidacaoComun {
    @IsClassEx(ValidaFilho)
    validaFilho!: ValidaFilho;

    @IsOptional()
    @IsClassEx(ValidaFilho)
    validaFilhoOp: Undefined<ValidaFilho>;

    @IsClassEx(ValidaFilho, { each: true })
    listaValidaFilho!: ValidaFilho[];
  }
});
