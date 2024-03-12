/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentOpenJobCtas, type TalentOpenJobCtasProps } from "./open";
import {
	TalentPrivateJobCtas,
	type TalentPrivateJobCtasProps,
} from "./private";

export const CTAS: {
	open: React.FC<TalentOpenJobCtasProps>;
	private: React.FC<TalentPrivateJobCtasProps>;
} = {
	open: TalentOpenJobCtas,
	private: TalentPrivateJobCtas,
};
