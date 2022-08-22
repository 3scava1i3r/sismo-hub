import { TestAttester } from "./test-attester";
import { MemoryAvailableDataStore } from "infrastructure/available-data";
import { MemoryFileStore } from "infrastructure/file-store";
import { MemoryGroupStore } from "infrastructure/group-store";
import { Network } from "topics/attester";
import { AvailableDataStore } from "topics/available-data";

describe("Test attester", () => {
  let testAttester: TestAttester;
  let testAvailableDataStore: AvailableDataStore;

  beforeEach(async () => {
    testAvailableDataStore = new MemoryAvailableDataStore();
    testAttester = new TestAttester({
      availableDataStore: testAvailableDataStore,
      availableGroupStore: new MemoryFileStore(""),
      groupStore: new MemoryGroupStore(),
    });
  });

  it("should fetch groups with internal collection id", async () => {
    const groupsWithId = [];
    for await (const groupWithId of testAttester.fetchGroups()) {
      groupsWithId.push(groupWithId);
    }
    expect(groupsWithId).toHaveLength(3);

    expect(groupsWithId[0].internalCollectionId).toBe(0);
    expect(groupsWithId[0].group.name).toBe("test-group");
    expect(groupsWithId[0].group.timestamp).toBe(1);

    expect(groupsWithId[1].internalCollectionId).toBe(0);
    expect(groupsWithId[1].group.name).toBe("test-group");
    expect(groupsWithId[1].group.timestamp).toBe(2);

    expect(groupsWithId[2].internalCollectionId).toBe(1);
    expect(groupsWithId[2].group.name).toBe("test-group2");
    expect(groupsWithId[2].group.timestamp).toBe(3);
  });

  it("should make groups available and save available data", async () => {
    await testAttester.compute(Network.Test);
    const availableData = await testAvailableDataStore.all();
    expect(availableData).toHaveLength(1);
    expect(availableData[0].attesterName).toBe(testAttester.name);
    expect(availableData[0].identifier).toBe("0x1");
    expect(availableData[0].transactionHash).toBe(undefined);
  });

  it("should make groups available and send on chain", async () => {
    await testAttester.compute(Network.Test, { sendOnChain: true });
    const availableData = await testAvailableDataStore.all();
    expect(availableData[0].transactionHash).toBe("fakeHash");
  });

  it("should throw error compute on wrong network", async () => {
    await expect(async () => {
      await testAttester.compute(Network.Local);
    }).rejects.toThrow();
  });
});

describe("Test attester badges", () => {
  let testAttester: TestAttester;

  beforeAll(async () => {
    testAttester = new TestAttester({
      availableDataStore: new MemoryAvailableDataStore(),
      availableGroupStore: new MemoryFileStore(""),
      groupStore: new MemoryGroupStore(),
    });
  });

  it("should have empty badges for other network", async () => {
    const badges = testAttester.getBadges(Network.Mainnet);
    expect(Object.keys(badges)).toHaveLength(0);
  });

  it("should have badges with valid collectionId", async () => {
    const badges = testAttester.getBadges(Network.Test);
    expect(Object.keys(badges)).toHaveLength(2);
    expect(badges[0].collectionId).toBe(
      "00000000000000000000000000000000000000000000000000000000000003e9"
    );
    expect(badges[0].name).toBe("Test Badge");
    expect(badges[1].collectionId).toBe(
      "00000000000000000000000000000000000000000000000000000000000003ea"
    );
    expect(badges[1].name).toBe("Test Badge 2");
  });
});