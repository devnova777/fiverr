/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as conversations from "../conversations.js";
import type * as gig from "../gig.js";
import type * as gigMedia from "../gigMedia.js";
import type * as gigs from "../gigs.js";
import type * as messages from "../messages.js";
import type * as offers from "../offers.js";
import type * as reviews from "../reviews.js";
import type * as seedCategories from "../seedCategories.js";
import type * as seedSubcategories from "../seedSubcategories.js";
import type * as skills from "../skills.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  conversations: typeof conversations;
  gig: typeof gig;
  gigMedia: typeof gigMedia;
  gigs: typeof gigs;
  messages: typeof messages;
  offers: typeof offers;
  reviews: typeof reviews;
  seedCategories: typeof seedCategories;
  seedSubcategories: typeof seedSubcategories;
  skills: typeof skills;
  stripe: typeof stripe;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
