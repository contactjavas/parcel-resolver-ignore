import fs from "fs";
import path from "path";
import { Resolver } from "@parcel/plugin";

export default new Resolver({
	async loadConfig({ config }) {
		const pkgJSONPath = path.join(process.cwd(), "package.json");
		const pkgJSON = JSON.parse(fs.readFileSync(pkgJSONPath));

		const { parcelIgnore = [] } = pkgJSON;
		const regexpPatterns = Array.isArray(parcelIgnore)
			? parcelIgnore
			: parcelIgnore[process.env.NODE_ENV] || [];

		config.invalidateOnFileChange(pkgJSONPath);

		return regexpPatterns;
	},
	async resolve({ specifier, config: regexpPatterns }) {
		const shouldExcludeFile = regexpPatterns.some((pattern) =>
			new RegExp(pattern).test(specifier)
		);

		console.log(`Checking ${specifier}`);

		if (shouldExcludeFile) {
			console.log(`Skipped ${specifier}`);
			return { isExcluded: true };
		}

		return null;
	},
});
