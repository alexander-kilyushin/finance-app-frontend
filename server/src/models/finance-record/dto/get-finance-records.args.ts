import { InputType, Field } from '@nestjs/graphql'

// types
import { IFinanceRecord } from '#interfaces/finance'

@InputType()
export class GetFinanceRecordsArgs {
	@Field(() => Boolean, { nullable: true })
	isTrashed?: IFinanceRecord['isTrashed']
}