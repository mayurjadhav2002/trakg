// Generate fake lead data
import { faker } from "@faker-js/faker";

export const generateLeads = (count: number) => {
	return Array.from({ length: count }).map(() => {
		const fullName = faker.person.fullName();
		const email = faker.internet.email();
		const phone = faker.phone.number();

		// Randomly pick one of the three for the display name field
		const randomDisplay = faker.helpers.arrayElement([fullName, email, phone]);

		return {
			uniqueId: faker.string.uuid(),
			name: randomDisplay, // 👈 name/email/phone randomly
			email,
			ip: faker.internet.ipv4(), // 👈 IPv4 only
			country: faker.location.country(),
			city: faker.location.city(),
			countryCode: faker.location.countryCode(),
			conversion: faker.datatype.boolean(),
			createdAt: faker.date.recent().toISOString(),
			formData: {
				name: fullName,
				email,
				phone,
				message: faker.lorem.sentence(),
			},
		};
	});
};
