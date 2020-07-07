// Outputs sheet: Ground-Based CTL column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod,
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { Harvesting } from '../methods/harvesting';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { BundleForwardResidue } from './methods/bundleforwardresidue';
import { Forwarding } from './methods/forwarding';

function GroundCTL(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcreST / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWtST + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.CalcResidues
    ? assumption.ResidueRecovFracCTL * intermediate.ResidueST
    : 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;
  // Amounts Unrecovered and Left within the Stand Per Acre
  const UncutTreesLarger80cf = intermediate.VolPerAcreLLT / 100;
  const ResiduesUncutTreesLarger80cf = intermediate.ResidueLLT;
  const GroundFuel = input.CalcResidues
    ? intermediate.ResidueST * (1 - assumption.ResidueRecovFracCTL)
    : intermediate.ResidueST;
  // Amounts Unrecovered and Left at the Landing
  const PiledFuel = 0;
  // TotalResidues
  const ResidueUncutTrees = 0;
  const TotalResidues =
    ResidueRecoveredPrimary +
    ResidueRecoveredOptional +
    ResidueUncutTrees +
    GroundFuel +
    PiledFuel;
  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const HarvestingResults = Harvesting(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostHarvest = HarvestingResults.CostHarvest;
  const ForwardingResults = Forwarding(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostForward = ForwardingResults.CostForward;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoadCTL = LoadingResults.CostLoadCTL;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipCTL = ChippingResults.CostChipCTL;
  const BundleForwardResidueResults = BundleForwardResidue(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostBundleResidue = BundleForwardResidueResults.CostBundleResidue;
  const CostForwardResidueBundles =
    BundleForwardResidueResults.CostForwardResidueBundles;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipBundledRes = ChippingResults.CostChipBundledRes;

  const GalHarvest = HarvestingResults.GalHarvest;
  const GalForward = ForwardingResults.GalForward;
  const GalLoadCTL = LoadingResults.GalLoadCTL;
  const GalChipCTL = ChippingResults.GalChipCTL;
  const GalBundleResidue = BundleForwardResidueResults.GalBundleResidue;
  const GalForwardResidueBundles =
    BundleForwardResidueResults.GalForwardResidueBundles;
  const GalChipBundledRes = ChippingResults.GalChipBundledRes;

  // C. For All Products, $/ac
  const HarvestTreesLess80cf = (CostHarvest * intermediate.VolPerAcreST) / 100;
  const ForwardTreesLess80cf = (CostForward * intermediate.VolPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf =
    (CostLoadCTL * intermediate.VolPerAcreSLT) / 100;
  const ChipCTLChipTreeBoles =
    (CostChipCTL *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcreST)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf +
    ForwardTreesLess80cf +
    (input.ChipAll === false ? LoadCTLlogTreesLess80cf : 0) +
    ChipCTLChipTreeBoles;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipCTLChipTreeBoles +
    (HarvestTreesLess80cf + ForwardTreesLess80cf) *
      (intermediate.BoleWtCT / intermediate.BoleWtST);
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFgroundCTL * BoleVolCCF
    : 0;
  const BundleCTLResidues = input.CalcResidues
    ? CostBundleResidue * ResidueRecoveredOptional
    : 0;
  const ForwardCTLResidues = input.CalcResidues
    ? CostForwardResidueBundles * ResidueRecoveredOptional
    : 0;
  const ChipBundledResiduesFromTreesLess80cf = input.CalcResidues
    ? CostChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein =
    ChipBundledResiduesFromTreesLess80cf +
    BundleCTLResidues +
    ForwardCTLResidues;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues
      ? MoveInCostsResults.CostPerCCFbundleResidues * ResidueRecoveredOptional
      : 0;

  // D. For All Products, gal/ac
  const HarvestTreesLess80cf2 = (GalHarvest * intermediate.VolPerAcreST) / 100;
  const ForwardTreesLess80cf2 = (GalForward * intermediate.VolPerAcreST) / 100;
  const LoadCTLlogTreesLess80cf2 =
    (GalLoadCTL * intermediate.VolPerAcreSLT) / 100;
  const ChipCTLChipTreeBoles2 =
    (GalChipCTL *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcreST)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    HarvestTreesLess80cf2 +
    ForwardTreesLess80cf2 +
    (input.ChipAll === false ? LoadCTLlogTreesLess80cf2 : 0) +
    ChipCTLChipTreeBoles2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    (HarvestTreesLess80cf2 + ForwardTreesLess80cf2) *
      (intermediate.BoleWtCT / intermediate.BoleWtST) +
    ChipCTLChipTreeBoles2;
  const LowboyLoads = 4;
  const LowboyLoadsResidues = 2; // bundler and forwarder used to collect residues
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? ((LowboyLoads + (input.CalcResidues ? LowboyLoadsResidues : 0)) *
        input.MoveInDist) /
      mpg /
      input.Area
    : 0;
  const BundleCTLResidues2 = input.CalcResidues
    ? GalBundleResidue * ResidueRecoveredOptional
    : 0;
  const ForwardCTLResidues2 = input.CalcResidues
    ? GalForwardResidueBundles * ResidueRecoveredOptional
    : 0;
  const ChipBundledResiduesFromTreesLess80cf2 = input.CalcResidues
    ? GalChipBundledRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 =
    BundleCTLResidues2 +
    ForwardCTLResidues2 +
    ChipBundledResiduesFromTreesLess80cf2;
  const Movein4Residues2 =
    input.CalcMoveIn && input.CalcResidues
      ? (2 * input.MoveInDist) / mpg / input.Area
      : 0;

  // III. Summaries
  const Total = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    DieselPerBoleCCF: 0,
    GasolinePerAcre: 0,
    GasolinePerBoleCCF: 0,
    JetFuelPerAcre: 0,
    JetFuelPerBoleCCF: 0
  };

  let Residue = {
    WeightPerAcre: 0,
    CostPerAcre: 0,
    CostPerBoleCCF: 0,
    CostPerGT: 0,
    DieselPerAcre: 0,
    DieselPerBoleCCF: 0,
    GasolinePerAcre: 0,
    GasolinePerBoleCCF: 0,
    JetFuelPerAcre: 0,
    JetFuelPerBoleCCF: 0
  };

  // System Summaries - Total
  Total.WeightPerAcre = TotalPrimaryProductsAndOptionalResidues;
  // Cost
  Total.CostPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  Total.CostPerBoleCCF = Total.CostPerAcre / BoleVolCCF;
  Total.CostPerGT = Total.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Total.DieselPerAcre =
    DieselStump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct2 +
    OntoTruck4ResiduesWoMovein2;
  Total.DieselPerBoleCCF = Total.DieselPerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre =
    Stump2Truck4ResiduesWithoutMovein +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein +
    OntoTruck4ResiduesWoMovein2 +
    Movein4Residues2;
  Residue.DieselPerBoleCCF = Residue.DieselPerAcre / BoleVolCCF;

  if (input.ChipAll) {
    Residue = Total;
  }

  return {
    Total,
    Residue,
  };
}

export { GroundCTL };
