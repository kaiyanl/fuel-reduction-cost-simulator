// Skidding sheet
import {
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../../frcs.model';

function Skidding(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  machineCost: MachineCostMod,
  TreesPerCycleIIB: number
) {
  // Skidding Calculated Values
  const TurnVol =
    (!input.PartialCut ? 44.87 : input.PartialCut ? 31.62 : 0) *
    Math.pow(intermediate.TreeVol, 0.282) *
    intermediate.CSlopeSkidForwLoadSize;
  const LogsPerTurnS = TurnVol / intermediate.LogVol;
  const TreesPerTurnS = TurnVol / intermediate.TreeVol;
  const PMH_SkidderB = machineCost.PMH_SkidderB;
  const PMH_SkidderS = machineCost.PMH_SkidderS;
  const SkidderHourlyCost =
    PMH_SkidderS * (1 - intermediate.ManualMachineSize) +
    PMH_SkidderB * intermediate.ManualMachineSize;

  // I Choker, Unbunched
  const MaxLogs = 10;
  const ChokerLogs = Math.min(MaxLogs, LogsPerTurnS);
  const ChokerTurnVol = ChokerLogs * intermediate.LogVol;
  // IA CC (Johnson&Lee, 88)
  const WinchDistSkidIA = 25;
  const TurnTimeSkidIA =
    -15.58 +
    0.345 * ChokerLogs +
    0.037 * ChokerTurnVol +
    4.05 * Math.log(input.DeliverDist + WinchDistSkidIA);
  const VolPerPMHskidIA = ChokerTurnVol / (TurnTimeSkidIA / 60);
  const CostPerCCFSkidIA = (100 * SkidderHourlyCost) / VolPerPMHskidIA;
  const RelevanceSkidIA =
    ChokerTurnVol < 90 ? 1 : ChokerTurnVol < 180 ? 2 - ChokerTurnVol / 90 : 0;
  // IB CC (Gibson&Egging, 73)
  const TurnTimeSkidIB =
    2.74 +
    0.726 * ChokerLogs +
    0.00363 * ChokerTurnVol * intermediate.BFperCF +
    0.0002 * ChokerTurnVol * intermediate.WoodDensity +
    0.00777 * input.DeliverDist +
    0.00313 * Math.pow(input.Slope, 2);
  const VolPerPMHskidIB = ChokerTurnVol / (TurnTimeSkidIB / 60);
  const CostPerCCFskidIB = (100 * SkidderHourlyCost) / VolPerPMHskidIB;
  const RelevanceSkidIB = 1;
  // IC CC (Schillings, 69) not used at present
  const TurnTimeSkidIC =
    (60 *
      (0.122 +
        0.089 +
        (0.000229 + 0.000704) * input.DeliverDist +
        (-0.00076 + 0.00127) * input.Slope +
        (0.0191 + 0.0118) * ChokerLogs)) /
    2;
  const VolPerPMHskidIC = ChokerTurnVol / (TurnTimeSkidIC / 60);
  const CostPerCCFskidIC = (100 * SkidderHourlyCost) / VolPerPMHskidIC;
  const RelevanceSkidIC = 0;
  // ID CC (Gardner, 79)
  const TurnTimeSkidID =
    2.57 +
    0.823 * ChokerLogs +
    0.0054 * ChokerTurnVol * intermediate.BFperCF +
    0.0078 * 2 * input.DeliverDist;
  const VolPerPMHskidID = ChokerTurnVol / (TurnTimeSkidID / 60);
  const CostPerCCFskidID = (100 * SkidderHourlyCost) / VolPerPMHskidID;
  const RelevanceSkidID = 1;
  // IE Cat 518 or Cat D4H, cable (Andersson, B. and G. Young  1998.
  // Harvesting coastal second growth forests: summary of harvesting system performance.
  // FERIC Technical Report TR-120)
  const TurnTimeSkidIE = 7.36 + 0.0053 * input.DeliverDist;
  const VolPerPMHskidIE = ChokerTurnVol / (TurnTimeSkidIE / 60);
  const CostPerCCFskidIE = (100 * SkidderHourlyCost) / VolPerPMHskidIE;
  const RelevanceSkidIE =
    intermediate.TreeVol < 5
      ? 0
      : intermediate.TreeVol < 15
      ? -0.5 + intermediate.TreeVol / 10
      : intermediate.TreeVol < 75
      ? 1
      : intermediate.TreeVol < 150
      ? 2 - intermediate.TreeVol / 75
      : 0;

  // II Grapple, Unbunched
  const IntMoveDistS = 17.0;
  // IIA Cat 518 (Johnson, 88)
  const TurnTimeSkidIIA =
    0.518 +
    0.0107 * input.DeliverDist +
    0.0011 * Math.pow(input.Slope, 3) +
    1.62 * Math.log(LogsPerTurnS);
  const VolPerPMHskidIIA = TurnVol / (TurnTimeSkidIIA / 60);
  const CostPerCCFskidIIA = (100 * SkidderHourlyCost) / VolPerPMHskidIIA;
  const RelevanceSkidIIA =
    intermediate.ButtDiam < 20
      ? 1
      : intermediate.ButtDiam < 25
      ? 5 - intermediate.ButtDiam / 5
      : 0;
  // IIB JD 648 (Gebhardt, 77)
  const GroundRatingSkidIIB = 1.1;
  const TypeOfCutSkidIIB = input.PartialCut ? 1.5 : 0;
  const TurnTimeSkidIIB =
    1.072 +
    0.00314 * input.DeliverDist +
    0.0192 * input.Slope +
    0.315 * TypeOfCutSkidIIB +
    0.489 * LogsPerTurnS -
    0.819 * GroundRatingSkidIIB +
    0.00469 * IntMoveDistS +
    0.00139 * TurnVol * intermediate.BFperCF;
  const VolPerPMHskidIIB = TurnVol / (TurnTimeSkidIIB / 60);
  const CostPerCCFskidIIB = (100 * SkidderHourlyCost) / VolPerPMHskidIIB;
  const RelevanceSkidIIB = 1;

  // III User-Defined Skidding Unbunched
  const VolPerPMHskidIII = 0.001;
  const CostPerCCFskidIII = (100 * SkidderHourlyCost) / VolPerPMHskidIII;
  const RelevanceSkidIII = 0;

  // IV Grapple, Bunched
  // IVA Grapple Skidders (Johnson, 88)
  const DeckHeightSkidIVA = 3;
  const TravEmptySkidIVA =
    -2.179 + 0.0362 * input.Slope + 0.711 * Math.log(input.DeliverDist);
  const LoadSkidIVA = Math.max(
    0,
    0.882 +
      0.0042 * Math.pow(input.Slope, 2) -
      0.000048 * Math.pow(TreesPerTurnS, 3)
  );
  const TravLoadedSkidIVA =
    -0.919 +
    0.00081 * input.DeliverDist +
    0.000062 * Math.pow(input.Slope, 3) +
    0.353 * Math.log(input.DeliverDist);
  const DeckSkidIVA =
    0.063 +
    0.55 * Math.log(DeckHeightSkidIVA) +
    0.0076 * DeckHeightSkidIVA * TreesPerTurnS;
  const TurnTImeSkidIVA =
    TravEmptySkidIVA + LoadSkidIVA + TravLoadedSkidIVA + DeckSkidIVA;
  const VolPerPMHskidIVA = TurnVol / (TurnTImeSkidIVA / 60);
  const CostPerCCFskidIVA = (100 * SkidderHourlyCost) / VolPerPMHskidIVA;
  const RelevanceSkidIVA =
    intermediate.ButtDiam < 15
      ? 1
      : intermediate.ButtDiam < 20
      ? 4 - intermediate.ButtDiam / 5
      : 0;
  // IVB Grapple Skidders (Tufts et al, 88)
  const EastsideAdjustmentSkidIVB = 1.3;
  const BunchSizeSkidIVB = TreesPerCycleIIB;
  const BunchVolSkidIVB = intermediate.TreeVol * BunchSizeSkidIVB;
  const TurnWtSkidIVB = TurnVol * intermediate.WoodDensity;
  const BunchesPerTurnSkidIVB = Math.max(1, TurnVol / BunchVolSkidIVB);
  const SkidderHpSkidIVB = 50.5 + 5.74 * Math.sqrt(intermediate.TreeVol);
  const TravEmptySkidIVB =
    (0.1905 * input.DeliverDist +
      0.3557 * SkidderHpSkidIVB -
      0.0003336 * input.DeliverDist * SkidderHpSkidIVB) /
    100;
  const GrappleSkidIVB = Math.min(
    5,
    (-38.36 +
      161.6 * BunchesPerTurnSkidIVB -
      0.5599 * BunchesPerTurnSkidIVB * SkidderHpSkidIVB +
      1.398 * BunchesPerTurnSkidIVB * BunchSizeSkidIVB) /
      100
  );
  const TravLoadedSkidIVB =
    (-34.52 +
      0.2634 * input.DeliverDist +
      0.7634 * SkidderHpSkidIVB -
      0.00122 * input.DeliverDist * SkidderHpSkidIVB +
      0.03782 * input.DeliverDist * BunchesPerTurnSkidIVB) /
    100;
  const UngrappleSkidIVB = Math.max(
    0,
    (5.177 * BunchesPerTurnSkidIVB +
      0.002508 * TurnWtSkidIVB -
      0.00007944 *
        TurnWtSkidIVB *
        BunchesPerTurnSkidIVB *
        BunchSizeSkidIVB *
        BunchesPerTurnSkidIVB) /
      100
  );
  const CycletimeSkidIVB =
    EastsideAdjustmentSkidIVB *
    (TravEmptySkidIVB + GrappleSkidIVB + TravLoadedSkidIVB + UngrappleSkidIVB);
  const VolPerPMHskidIVB = TurnVol / (CycletimeSkidIVB / 60);
  const CostPerCCFskidIVB = (100 * SkidderHourlyCost) / VolPerPMHskidIVB;
  const RelevanceSkidIVB = 0.5;
  // IVC John Deere 748E (Kosicki, K. 00. Productivities and costs of two harvesting trials
  // in a western Alberta riparian zone. FERIC Advantage 1(19))
  const LoadingStopsSkidIVC = 2.1;
  const TurnTimeSkidIVC =
    0.65 + 0.0054 * input.DeliverDist + 0.244 * LoadingStopsSkidIVC;
  const VolPerPMHskidIVC = TurnVol / (TurnTimeSkidIVC / 60);
  const CostPerCCFskidIVC = (100 * SkidderHourlyCost) / VolPerPMHskidIVC;
  const RelevanceSkidIVC =
    intermediate.TreeVol < 5
      ? 0
      : intermediate.TreeVol < 10
      ? -1 + intermediate.TreeVol / 5
      : intermediate.TreeVol < 50
      ? 1
      : intermediate.TreeVol < 100
      ? 2 - intermediate.TreeVol / 50
      : 0;
  // IVD Cat D5H TSK Custom Track (Henderson, B. 01. Roadside harvesting with low ground-presssure skidders
  // in northwestern British Columbia. FERIC Advantage 2(54))
  const TurnTimeSkidIVD = 2.818 + 0.0109 * input.DeliverDist;
  const VolPerPMHskidIVD = TurnVol / (TurnTimeSkidIVD / 60);
  const CostPerCCFskidIVD = (100 * SkidderHourlyCost) / VolPerPMHskidIVD;
  const RelevanceSkidIVD =
    intermediate.TreeVol < 5
      ? 0
      : intermediate.TreeVol < 10
      ? -1 + intermediate.TreeVol / 5
      : intermediate.TreeVol < 50
      ? 1
      : intermediate.TreeVol < 100
      ? 2 - intermediate.TreeVol / 50
      : 0;
  // IVE JD 748_G-II & TJ 560 (Kosicki, K. 02. Productivity and
  // cost of summer harvesting in a central Alberta mixedwood stand. FERIC Advantage 3(6))
  const BunchesPerTurnSkidIVE = BunchesPerTurnSkidIVB;
  const TurnTimeSkidIVE =
    0.649 + 0.0058 * input.DeliverDist + 0.581 * BunchesPerTurnSkidIVE;
  const VolPerPMHskidIVE = TurnVol / (TurnTimeSkidIVE / 60);
  const CostPerCCFskidIVE = (100 * SkidderHourlyCost) / VolPerPMHskidIVE;
  const RelevanceSkidIVE =
    intermediate.TreeVol < 30
      ? 1
      : intermediate.TreeVol < 60
      ? 2 - intermediate.TreeVol / 30
      : 0;
  // IVF Tigercat 635 (Boswell, B. 98. Vancouver Island mechanized thinning trials. FERIC Technical Note TN-271)
  const TurnTimeSkidIVF = 5.77 + 0.007 * input.DeliverDist;
  const VolPerPMHskidIVF = TurnVol / (TurnTimeSkidIVF / 60);
  const CostPerCCFskidIVF = (100 * SkidderHourlyCost) / VolPerPMHskidIVF;
  const RelevanceSkidIVF =
    intermediate.TreeVol < 5
      ? 0
      : intermediate.TreeVol < 10
      ? -1 + intermediate.TreeVol / 5
      : intermediate.TreeVol < 100
      ? 1
      : intermediate.TreeVol < 150
      ? 3 - intermediate.TreeVol / 50
      : 0;
  // IVG Tigercat 635 (Kosicki, K. 02. Evaluation of Trans-Gesco TG88C and
  // Tigercat 635 grapple skidders working in central Alberta. FERIC Advantage 3(37))
  const TreesPerTurnSkidIVG = TreesPerTurnS;
  const TurnTimeSkidIVG =
    2.98 + 0.006 * input.DeliverDist + 0.27 * TreesPerTurnSkidIVG;
  const VolPerPMHskidIVG = TurnVol / (TurnTimeSkidIVG / 60);
  const CostPerCCFskidIVG = (100 * SkidderHourlyCost) / VolPerPMHskidIVG;
  const RelevanceSkidIVG =
    intermediate.TreeVol < 40
      ? 1
      : intermediate.TreeVol < 80
      ? 2 - intermediate.TreeVol / 40
      : 0;
  // IVH User-Defined Skidding Bunched
  const VolPerPMHskidIVH = 0.001;
  const CostPerCCFskidIVH = (100 * SkidderHourlyCost) / VolPerPMHskidIVH;
  const RelevanceSkidIVH = 0;
  // Skidding Summary
  // CostSkidUB ($/CCF)
  const RelevanceSumUB =
    RelevanceSkidIA +
    RelevanceSkidIB +
    RelevanceSkidIC +
    RelevanceSkidID +
    RelevanceSkidIE +
    RelevanceSkidIIA +
    RelevanceSkidIIB +
    RelevanceSkidIII;
  const WeightedCostPerPMHUB =
    (SkidderHourlyCost * RelevanceSkidIA +
      SkidderHourlyCost * RelevanceSkidIB +
      SkidderHourlyCost * RelevanceSkidIC +
      SkidderHourlyCost * RelevanceSkidID +
      SkidderHourlyCost * RelevanceSkidIE +
      SkidderHourlyCost * RelevanceSkidIIA +
      SkidderHourlyCost * RelevanceSkidIIB +
      SkidderHourlyCost * RelevanceSkidIII) /
    RelevanceSumUB;
  const WeightedVolPerPMHUB =
    (RelevanceSkidIA * VolPerPMHskidIA +
      RelevanceSkidIB * VolPerPMHskidIB +
      RelevanceSkidIC * VolPerPMHskidIC +
      RelevanceSkidID * VolPerPMHskidID +
      RelevanceSkidIE * VolPerPMHskidIE +
      RelevanceSkidIIA * VolPerPMHskidIIA +
      RelevanceSkidIIB * VolPerPMHskidIIB +
      RelevanceSkidIII * VolPerPMHskidIII) /
    RelevanceSumUB;
  const CostSkidUB =
    (intermediate.CHardwood * 100 * WeightedCostPerPMHUB) / WeightedVolPerPMHUB;
  // GalSkidUB (gal/CCF)
  const HorsepowerSkidderS = 120;
  const HorsepowerSkidderB = 200;
  const fcrSkidder = 0.028;
  const WeightedGalPerPMH =
    HorsepowerSkidderS * fcrSkidder * (1 - intermediate.ManualMachineSize) +
    HorsepowerSkidderB * fcrSkidder * intermediate.ManualMachineSize;
  const GalSkidUB = (WeightedGalPerPMH * CostSkidUB) / WeightedCostPerPMHUB;
  // CostSkidBun
  const RelevanceSumB =
    RelevanceSkidIVA +
    RelevanceSkidIVB +
    RelevanceSkidIVC +
    RelevanceSkidIVD +
    RelevanceSkidIVE +
    RelevanceSkidIVF +
    RelevanceSkidIVG +
    RelevanceSkidIVH;
  const WeightedCostPerPMHB =
    (SkidderHourlyCost * RelevanceSkidIVA +
      SkidderHourlyCost * RelevanceSkidIVB +
      SkidderHourlyCost * RelevanceSkidIVC +
      SkidderHourlyCost * RelevanceSkidIVD +
      SkidderHourlyCost * RelevanceSkidIVE +
      SkidderHourlyCost * RelevanceSkidIVF +
      SkidderHourlyCost * RelevanceSkidIVG +
      SkidderHourlyCost * RelevanceSkidIVH) /
    RelevanceSumB;
  const WeightedVolPerPMHB =
    (RelevanceSkidIVA * VolPerPMHskidIVA +
      RelevanceSkidIVB * VolPerPMHskidIVB +
      RelevanceSkidIVC * VolPerPMHskidIVC +
      RelevanceSkidIVD * VolPerPMHskidIVD +
      RelevanceSkidIVE * VolPerPMHskidIVE +
      RelevanceSkidIVF * VolPerPMHskidIVF +
      RelevanceSkidIVG * VolPerPMHskidIVG +
      RelevanceSkidIVH * VolPerPMHskidIVH) /
    RelevanceSumB;
  const CostSkidBun =
    (intermediate.CHardwood * 100 * WeightedCostPerPMHB) / WeightedVolPerPMHB;
  // GalSkidBun
  const GalSkidBun = (WeightedGalPerPMH * CostSkidBun) / WeightedCostPerPMHB;

  return {
    CostSkidBun: CostSkidBun,
    CostSkidUB: CostSkidUB,
    GalSkidUB: GalSkidUB,
    GalSkidBun: GalSkidBun
  };
}

export { Skidding };
