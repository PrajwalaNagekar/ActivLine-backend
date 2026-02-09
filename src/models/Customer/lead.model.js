export class LeadModel {
  constructor(data) {
    Object.assign(this, data);
  }

  static sanitize(data) {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
  }
}
