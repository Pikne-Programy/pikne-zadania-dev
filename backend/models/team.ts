// Copyright 2021 Marcin Wykpis <marwyk2003@gmail.com>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TeamType } from "../types/mod.ts";
import { IDatabaseService, ITeam } from "../interfaces/mod.ts";

export class Team implements ITeam {
  constructor(
    private db: IDatabaseService,
    public readonly id: number,
  ) {}

  private async get<T extends keyof TeamType>(key: T): Promise<TeamType[T]> {
    const team = await this.db.teams!.findOne({ id: this.id });
    if (!team) throw new Error(); // TODO: error message
    return team[key];
  }
  private async set<T extends keyof TeamType>(key: T, value: TeamType[T]) {
    if (!await this.exists()) throw new Error(); // TODO: error message
    await this.db.teams!.updateOne({ id: this.id }, { $set: { [key]: value } });
  }

  async exists() {
    return (await this.db.teams!.findOne({ id: this.id })) ? true : false;
  }

  readonly name = {
    get: async () => await this.get("name"),
    set: async (value: string) => await this.set("name", value),
  };

  readonly assignee = {
    get: async () => await this.get("assignee"),
    set: async (value: string) => await this.set("assignee", value),
  };

  readonly members = {
    add: async (uid: string) => {
      await this.db.teams!.updateOne({ id: this.id }, {
        $push: { members: uid },
      });
    },
    get: async () => await this.get("members"),
    remove: async (uid: string) => {
      await this.db.teams!.updateOne({ id: this.id }, {
        $pull: { members: uid },
      });
    },
  };

  readonly invitation = {
    get: async () => await this.get("invitation"),
    set: async (value?: string) => {
      if (
        value !== undefined &&
        (await this.db.teams!.findOne({ invitation: value }))?.id !== this.id
      ) {
        throw new Error("Invalid invitation"); // TODO: error message
      }
      await this.db.teams!.updateOne({ id: this.id }, {
        $set: { value },
      });
    },
  };
}
