import { StatusCodes, ReasonCodes, RegionCodes, LandUseTypeCodes } from './application';

describe('application constants', () => {
  describe('StatusCodes', () => {
    describe('getCodeGroups()', () => {
      it('returns all 6 code groups', () => {
        const codeGroups = new StatusCodes().getCodeGroups();
        expect(codeGroups.length).toEqual(6);
        expect(codeGroups).toContain(StatusCodes.ABANDONED);
        expect(codeGroups).toContain(StatusCodes.APPLICATION_UNDER_REVIEW);
        expect(codeGroups).toContain(StatusCodes.APPLICATION_REVIEW_COMPLETE);
        expect(codeGroups).toContain(StatusCodes.DECISION_APPROVED);
        expect(codeGroups).toContain(StatusCodes.DECISION_NOT_APPROVED);
        expect(codeGroups).toContain(StatusCodes.UNKNOWN);
      });
    });
  });

  describe('ReasonCodes', () => {
    describe('getCodeGroups()', () => {
      it('returns 2 code groups', () => {
        const codeGroups = new ReasonCodes().getCodeGroups();
        expect(codeGroups.length).toEqual(2);
        expect(codeGroups).toContain(ReasonCodes.AMENDMENT_APPROVED);
        expect(codeGroups).toContain(ReasonCodes.AMENDMENT_NOT_APPROVED);
      });
    });
  });

  describe('RegionCodes', () => {
    describe('getCodeGroups()', () => {
      it('returns all 8 code groups', () => {
        const codeGroups = new RegionCodes().getCodeGroups();
        expect(codeGroups.length).toEqual(8);
        expect(codeGroups).toContain(RegionCodes.CARIBOO);
        expect(codeGroups).toContain(RegionCodes.KOOTENAY);
        expect(codeGroups).toContain(RegionCodes.LOWER_MAINLAND);
        expect(codeGroups).toContain(RegionCodes.OMENICA);
        expect(codeGroups).toContain(RegionCodes.PEACE);
        expect(codeGroups).toContain(RegionCodes.SKEENA);
        expect(codeGroups).toContain(RegionCodes.SOUTHERN_INTERIOR);
        expect(codeGroups).toContain(RegionCodes.VANCOUVER_ISLAND);
      });
    });
  });

  describe('LandUseTypeCodes', () => {
    describe('getCodeGroups()', () => {
      it('returns all 16 code groups', () => {
        const codeGroups = new LandUseTypeCodes().getCodeGroups();
        expect(codeGroups.length).toEqual(16);
        expect(codeGroups).toContain(LandUseTypeCodes['CERTIFICATE OF PURCHASE']);
        expect(codeGroups).toContain(LandUseTypeCodes['CROWN GRANT']);
        expect(codeGroups).toContain(LandUseTypeCodes['DEVELOPMENT AGREEMENT']);
        expect(codeGroups).toContain(LandUseTypeCodes['DOMINION PATENTS']);
        expect(codeGroups).toContain(LandUseTypeCodes.INCLUSION);
        expect(codeGroups).toContain(LandUseTypeCodes.INVENTORY);
        expect(codeGroups).toContain(LandUseTypeCodes.LEASE);
        expect(codeGroups).toContain(LandUseTypeCodes.LICENCE);
        expect(codeGroups).toContain(LandUseTypeCodes['OIC ECOLOGICAL RESERVE ACT']);
        expect(codeGroups).toContain(LandUseTypeCodes.PERMIT);
        expect(codeGroups).toContain(LandUseTypeCodes['PRE-TANTALIS']);
        expect(codeGroups).toContain(LandUseTypeCodes['PROVINCIAL PARK']);
        expect(codeGroups).toContain(LandUseTypeCodes['RESERVE/NOTATION']);
        expect(codeGroups).toContain(LandUseTypeCodes['REVENUE SHARING AGREEMENT']);
        expect(codeGroups).toContain(LandUseTypeCodes['RIGHT-OF-WAY']);
        expect(codeGroups).toContain(LandUseTypeCodes['TRANSFER OF ADMINISTRATION/CONTROL']);
      });
    });
  });
});
