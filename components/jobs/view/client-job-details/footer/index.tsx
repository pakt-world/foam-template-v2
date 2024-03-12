/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientOpenJobCtas, type ClientOpenJobCtasProps } from "./open";
import {
	ClientPrivateJobCtas,
	type ClientPrivateJobCtasProps,
} from "./private";

export const CTAS: {
	open: React.FC<ClientOpenJobCtasProps>;
	private: React.FC<ClientPrivateJobCtasProps>;
} = {
	open: ClientOpenJobCtas,
	private: ClientPrivateJobCtas,
};
