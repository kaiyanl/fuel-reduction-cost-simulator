// Forwarding sheet
import { CostMachineMod } from '../frcs.model';

function Forwarding(Slope: number, WoodDensityST: number, TreeVolST: number, CTLTrailSpacing: number,
                    DBHST: number, CSlopeSkidForwLoadSize: number, VolPerAcreST: number,
                    MechMachineSize: number, YardDist: number, CTLLogVol: number,
                    CostMachine: CostMachineMod, CHardwoodST: number) {

    // Forwarding Inputs
    const BoomReachF = 20;
    const LoadFraction = 0.95;
    // Forwarding Calculated Values
    const DistPerMoveF = 1.5 * BoomReachF;
    const ForwarderHourlyCost = CostMachine.PMH_ForwarderS
        * (1 - MechMachineSize) + CostMachine.PMH_ForwarderB * MechMachineSize;
    // A) Timberjack 230A 8-ton (Schroder&Johnson, 97)
    const MaxLoadWeightA = 8;
    const LoadVolA = LoadFraction * MaxLoadWeightA * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const DistIntermA = (LoadVolA / VolPerAcreST) * 43560 / CTLTrailSpacing;
    const DistOutA = YardDist + DistIntermA / 2;
    const DistInA = Math.max(0, YardDist - DistIntermA / 2);
    const MovesA = DistIntermA / DistPerMoveF;
    const Paint = 1;
    const TravelOutA = 1.75519 + 0.00433 * DistOutA;
    const Loada = 0.93149 + 0.02219 * LoadFraction * 100 + 0.17581 * MovesA - 0.00133 * LoadFraction * 100 * MovesA;
    const LoadA = Math.pow(Loada, 2);
    const TravelInterma = 0.61205 - 0.17877 * Paint + 5.40853 * Math.pow(10, -7) * Math.pow(DistInA, 2)
        + 0.00115 * DistIntermA + 0.011067 * LoadFraction * 100;
    const TravelIntermA = Math.pow(TravelInterma, 2);
    const TravelLoadedA = 2.5626 + 3.53836 * Math.pow(10, -6) * Math.pow(DistInA, 2);
    const UnloadA = Math.exp(0.61358 + 0.01378 * LoadFraction * 100);
    const TurnTimeA = TravelOutA + LoadA + TravelIntermA + TravelLoadedA + UnloadA;
    const VolPerPMHAforward = LoadVolA / (TurnTimeA / 60);
    const CostPerCCFAforward = 100 * ForwarderHourlyCost / VolPerPMHAforward;
    const RelevanceAforward = TreeVolST < 25 ? 1 : (TreeVolST < 50 ? 2 - TreeVolST / 25 : 0);
    // B) Rottne 10-ton (McNeel&Rutherford, 94)
    const MaxLoadWeightB = 1.1 * 10;
    const LoadVolB = LoadFraction * MaxLoadWeightB * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const DistIntermB = (LoadVolB / VolPerAcreST) * 43560 / CTLTrailSpacing;
    const DistOutB = YardDist + DistIntermB / 2;
    const DistInB = Math.max(0, YardDist - DistIntermB / 2);
    const MovesB = DistIntermB / DistPerMoveF;
    const LandingMovesB = 0.5;
    const LandingMoveDistPerMoveB = 100;
    const TravelOutB = 0.342 + 0.0135 * 0.305 * DistOutB;
    const LoadB = 9.248;
    const SortWoodsB = 2.054;
    const TravelIntermB = (0.2048 + 0.0146 * 0.305 * DistPerMoveF) * MovesB;
    const TravelLoadedB = 0.239 + 0.0125 * 0.305 * DistInB;
    const UnloadB = 5.385;
    const SortLandingB = 2.104;
    const MoveLandingB = (0.1763 + 0.0061 * 0.305 * LandingMoveDistPerMoveB) * LandingMovesB;
    const TurnTimeB = TravelOutB + LoadB + SortWoodsB + TravelIntermB
        + TravelLoadedB + UnloadB + SortLandingB + MoveLandingB;
    const VolPerPMHBforward = LoadVolB / (TurnTimeB / 60);
    const CostPerCCFBforward = 100 * ForwarderHourlyCost / VolPerPMHBforward;
    const RelevanceBforward = DBHST < 16 ? 1 : (DBHST < 20 ? 5 - DBHST / 4 : 0);
    // C) FMG 910 (Kellogg&Bettinger, 94)
    const MaxLoadWeightC = 1.1 * 9;
    const LoadVolC = LoadFraction * MaxLoadWeightC * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const DistIntermC = (LoadVolC / VolPerAcreST) * 43560 / CTLTrailSpacing;
    const DistOutC = YardDist + DistIntermC / 2;
    const DistInC = Math.max(0, YardDist - DistIntermC / 2);
    const MixedDummyC = 0.8;
    const PulpDummyC = 0.1;
    const VolPerPMHCforward = Math.max(100, 573.7 - 59.7 * MixedDummyC - 122.8 * PulpDummyC
        + 0.2707 * LoadVolC - 0.086 * DistOutC - 0.062 * DistIntermC - 0.042 * DistInC);
    const CostPerCCFCforward = 100 * ForwarderHourlyCost / VolPerPMHCforward;
    const RelevanceCforward = TreeVolST < 40 ? 1 : (TreeVolST < 80 ? 2 - TreeVolST / 40 : 0);
    // D) Valmet 646 12-ton (Drews et al, 00)
    const MaxLoadWeightD = 1.1 * 12;
    const LoadVolD = LoadFraction * MaxLoadWeightD * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const DistIntermD = (LoadVolD / VolPerAcreST) * 43560 / CTLTrailSpacing;
    const DistOutD = YardDist + DistIntermD / 2;
    const DistInD = Math.max(0, YardDist - DistIntermD / 2);
    const RoadDistD = 50;
    const MultipleCorridorDummyD = 0.08;
    const ColdDummyD = 0.83;
    const SawlogFractionD = 0.02;
    const TravelEmptyOnRoadD = (11.25 + 0.26 * RoadDistD) / 100;
    const TravelOutAndTravelLoadedD = (103.36 + 0.8114 * YardDist + 0.0117 * YardDist * Slope) / 100;
    const LoadD = (235.81 + Math.max(0, 1549.6 * LoadFraction - 128.48 * LoadFraction * CTLLogVol)) / 100;
    const TravelIntermD = (51.21 + 0.7519 * DistIntermD + 90.84 * MultipleCorridorDummyD) / 100;
    const TravelLoadedOnRoadD = (36.82 + 0.198 * RoadDistD) / 100;
    const UnloadD = (-162 + 852.2 * LoadFraction + 5105 * ColdDummyD * SawlogFractionD) / 100;
    const TurnTimeD = TravelEmptyOnRoadD + TravelOutAndTravelLoadedD
        + LoadD + TravelIntermD + TravelLoadedOnRoadD + UnloadD;
    const VolPerPMHDforward = LoadVolD / (TurnTimeD / 60);
    const CostPerCCFDforward = 100 * ForwarderHourlyCost / VolPerPMHDforward;
    const RelevanceDforward = DBHST < 12 ? 1 : (DBHST < 20 ? 2.5 - DBHST / 8 : 0);
    // E) TJ 1010 (Sambo, S. 99. Reduction of trail density in a partial cut with a cut-to-length system.
    // FERIC Technical Note TN 293)
    const MaxLoadWeightE = 1.1 * 12;
    const LoadVolE = LoadFraction * MaxLoadWeightE * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const PiecesE = LoadVolE / CTLLogVol;
    const TurnTimeE = 10.7 + 0.14 * PiecesE + 0.01 * (YardDist / 3.28);
    const VolPerPMHEforward = LoadVolB / (TurnTimeE / 60);
    const CostPerCCFEforward = 100 * ForwarderHourlyCost / VolPerPMHEforward;
    const RelevanceEforward = TreeVolST < 10 ? 1 : (TreeVolST < 20 ? 2 - TreeVolST / 10 : 0);
    // F) Fabtek 546B (Bolding, M.C. 03. Forest fuel reduction and energywood production
    // using a CTL/small chipper harvesting system,  M.S. Thesis, Auburn Univ)
    const MaxLoadWeightF = 15;
    const LoadVolF = LoadFraction * MaxLoadWeightF * 2000 / WoodDensityST * CSlopeSkidForwLoadSize;
    const DistIntermF = (LoadVolF / VolPerAcreST) * 43560 / CTLTrailSpacing;
    const DistOutF = YardDist + DistIntermF / 2;
    const DistInF = Math.max(0, YardDist - DistIntermF / 2);
    const LoadingStopsF = DistIntermF / DistPerMoveF;
    const TravelEmptyF = 0.0028 * DistOutF;
    const TravelWhileLoadingF = 0.0087 * DistIntermF;
    const LoadF = 5.32 + 0.732 * LoadingStopsF;
    const TravelLoadedF = 0.0028 * DistInF;
    const UnloadF = (0.001 * LoadVolF * WoodDensityST) / 3;
    const WaitF = 0;
    const TurnTimeF = TravelEmptyF + TravelWhileLoadingF + LoadF + TravelLoadedF + UnloadF + WaitF;
    const VolPerPMHFforward = LoadVolD / (TurnTimeF / 60);
    const CostPerCCFFforward = 100 * ForwarderHourlyCost / VolPerPMHFforward;
    const RelevanceFforward = TreeVolST < 20 ? 1 : (TreeVolST < 40 ? 2 - TreeVolST / 20 : 0);
    // G) User-Defined
    const VolPerPMHGforward = 0.001;
    const CostPerCCFGforward = 100 * ForwarderHourlyCost / VolPerPMHGforward;
    const RelevanceGforward = 0;
    // Summary
    const CostForward = TreeVolST > 0 ?
        CHardwoodST * 100 * (ForwarderHourlyCost * RelevanceAforward + ForwarderHourlyCost * RelevanceBforward
        + ForwarderHourlyCost * RelevanceCforward + ForwarderHourlyCost * RelevanceDforward
            + ForwarderHourlyCost * RelevanceEforward + ForwarderHourlyCost * RelevanceFforward
            + ForwarderHourlyCost * RelevanceGforward) / (RelevanceAforward * VolPerPMHAforward
                + RelevanceBforward * VolPerPMHBforward + RelevanceCforward * VolPerPMHCforward
                + RelevanceDforward * VolPerPMHDforward + RelevanceEforward * VolPerPMHEforward
                + RelevanceFforward * VolPerPMHFforward + RelevanceGforward * VolPerPMHGforward) : 0;

    return CostForward;
}

export { Forwarding };
