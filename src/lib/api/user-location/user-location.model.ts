export interface UserLocationRequest {
	locationId?: string
	usersToAdd?: string[]
	usersToRemove?: string[]
}

export interface LocationUser {
	fullName?: string
	userId?: string
	startOn?: number
	endOn?: number
}

export interface UserLocationResponse {
	locationId?: string,
	users: LocationUser[]
}
