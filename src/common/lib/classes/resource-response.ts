export class ResourceResponse {
  static whenLoaded(relationship, callback) {
    if (relationship) return callback();
  }
}
