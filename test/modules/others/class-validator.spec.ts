import { ClassVto, EnumVto, IntVto, NumberVto, StringVto } from '@vto'
import { plainToInstance } from 'class-transformer'
import { IsOptional, validateSync } from 'class-validator'
import { Undefined } from '@typings/generic.typing'
import { PoliticaStatusEnum } from '@enums/politica-status.enum'

describe('ClassValidator', () => {
  it('Deve validar todos os tipos com sucesso', () => {
    const data = {
      // Primitivo
      palavra: 'Mundo',
      numeroComoPalavra: '0145',
      numeroDecimal: 0.14,
      numeroInteiro: 14,
      enumQualquer: PoliticaStatusEnum.PUBLICADO,
      // Primitivo Opcional
      palavraOp: undefined,
      numeroOp: undefined,
      enumQualquerOp: undefined
    }

    const obj = {
      ...data,
      validaFilho: data,
      validaFilhoOp: undefined,
      listaValidaFilho: [data]
    }

    const classe = plainToInstance(ValidaGeral, obj)
    const errors = validateSync(classe)

    expect(errors).toStrictEqual([])
  })

  abstract class ValidacaoComun {
    // Primitivos
    @StringVto()
    palavra: string

    @StringVto()
    numeroComoPalavra: string

    @NumberVto()
    numeroDecimal: number

    @IntVto()
    numeroInteiro: number

    @EnumVto(PoliticaStatusEnum)
    enumQualquer: PoliticaStatusEnum

    // Primitivos opcionais
    @IsOptional()
    @StringVto()
    palavraOp: Undefined<string>

    @IsOptional()
    @NumberVto()
    numeroOp: Undefined<number>

    @IsOptional()
    @EnumVto(PoliticaStatusEnum)
    enumQualquerOp: PoliticaStatusEnum
  }
  class ValidaFilho extends ValidacaoComun {}

  class ValidaGeral extends ValidacaoComun {
    @ClassVto(ValidaFilho)
    validaFilho: ValidaFilho

    @IsOptional()
    @ClassVto(ValidaFilho)
    validaFilhoOp: Undefined<ValidaFilho>

    @ClassVto(ValidaFilho, { each: true })
    listaValidaFilho: ValidaFilho[]
  }
})
