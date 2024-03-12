export interface User {
	_id: string;
	type?: string;
	email?: string | undefined;
	lastName?: string;
	firstName?: string;
	score?: number;
	profileCompleteness?: number;
	profileImage?: {
		url: string;
	};
	profile?: {
		contact?: {
			city?: string;
			state?: string;
			phone?: string;
			address?: string;
			country?: string;
		};
		bio?: {
			title?: string;
			description?: string;
		};
		talent: {
			availability?: string;
			tags?: string[];
			tagsIds?: Array<{ name: string; color: string }>;
			about?: string;
		};
	};
	twoFa?: {
		status?: boolean;
		type?: string;
	};
	achievements?: AchievementProps[];
	// VerifyEmailResponse
	token?: string;
	expiresIn?: number;
	kyc?: boolean;
}

export interface Job {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	creator: UserProfile;
	category: string;
	escrowPaid: boolean;
	progress: number; // 0 - 100
	isPrivate: boolean;
	deliveryDate: string;
	description: string;
	paymentFee: number;
	tags: Array<{
		type: "tags";
		name: string;
		color: string;
	}>;
	// talent assigned to the job
	owner?: UserProfile;
	ratings: Rating[] | null;
	tagsData: string[];
	invites: unknown[]; // TODO: add type
	invite?: {
		_id: string;
		sender: UserProfile;
		receiver: UserProfile;
		status: "pending" | "accepted" | "rejected" | "cancelled";
	};
	status: JobStatus;
	bookmarkId?: string;
	isBookmarked?: boolean;
	inviteAccepted: boolean;
	recipientCompletedJob: boolean;
	collections: Collection[];
	parent?: Collection;
	payoutStatus: "pending" | "ongoing" | "completed" | "waiting" | "cancelled";
	type?: string;
}

export interface UserProfile {
	_id: string;
	score: number;
	lastName: string;
	firstName: string;
	profileImage?: {
		url: string;
	};
	profile: {
		bio: {
			title: string;
			availability: string;
			tags: unknown[]; // TODO: add type
		};
		talent: {
			tags: string[];
			tagsIds?: Array<{ name: string; color: string }>;
		};
	};
}

export type JobStatus =
	| "pending"
	| "ongoing"
	| "completed"
	| "waiting"
	| "cancelled";

interface Rating {
	_id: string;
	review: string;
	rating: number;
	createdAt: string;
	updatedAt: string;
	owner: UserProfile;
	receiver: UserProfile;
}

export interface JobDeliverable {
	_id: string;
	name: string;
	progress: number; // 0 or 100
	updatedAt: string;
	type: "deliverable";
	description: string;
	status: "pending" | "ongoing" | "completed";
	creator: UserProfile;
	meta?: Record<string, unknown>;
}

export interface JobApplicant {
	_id: string;
	name: string;
	createdAt: string;
	paymentFee: number;
	description: string;
	type: "application";
	creator: UserProfile;
}

export interface JobCancellation {
	name: string;
	_id: string;
	description: string;
	creator: UserProfile;
	type: "cancellation";
}

export interface ReviewChangeRequest {
	_id: string;
	name: string;
	description: string;
	creator: UserProfile;
	type: "review_change_request";
	status: "pending" | "completed";
}

type Collection =
	| JobDeliverable
	| JobApplicant
	| JobCancellation
	| ReviewChangeRequest;

export const isJobDeliverable = (
	collection: Collection,
): collection is JobDeliverable => {
	return collection.type === "deliverable";
};

export const isJobApplicant = (
	collection: Collection,
): collection is JobApplicant => {
	return collection.type === "application";
};

export const isJobCancellation = (
	collection: Collection,
): collection is JobCancellation => {
	return collection.type === "cancellation";
};

export const isReviewChangeRequest = (
	collection: Collection,
): collection is ReviewChangeRequest => {
	return collection.type === "review_change_request";
};

export const hasFiveStarReview = (reviews: Review[]): boolean => {
	const hasFiveStar = reviews.filter((r) => r.rating === 5);
	return hasFiveStar.length > 0;
};

export interface ImageUp {
	file: File;
	preview: string;
	id: string;
	name: string;
	size: string;
}

export interface AchievementProps {
	type: string;
	value: string;
	total: number;
}
export interface DataFeedResponse {
	closed: boolean;
	createdAt?: string;
	updatedAt?: string;
	creator: User;
	data: Job;
	description: string;
	isBookmarked?: boolean;
	bookmarkId?: string;
	isPublic?: boolean;
	owner: User;
	owners?: User[];
	title: string;
	type: string;
	meta?: {
		value: number;
		isMarked: boolean;
		rating: number;
	};
	_id: string;
}

export interface Bookmark {
	_id: string;
	type: string;
	owner?: User;
	data: Job;
	feed: DataFeedResponse;
}

export interface Review {
	_id: string;
	data: Job;
	owner: User;
	rating: number;
	receiver: User;
	review: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CountryProps {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	region_id: string;
	subregion: string;
	subregion_id: string;
	nationality: string;
	timezones: Timezone[];
	translations: Record<string, string>;
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

interface Timezone {
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

export interface StateProps {
	id: number;
	name: string;
	country_id: number;
	country_code: string;
	country_name: string;
	state_code: string;
	type: string | null;
	latitude: string;
	longitude: string;
}
