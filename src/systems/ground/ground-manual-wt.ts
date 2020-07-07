// Outputs sheet: Ground-Based Manual WT column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod,
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellwtSmallLogOther } from '../methods/fellwtsmalllogother';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { Processing } from '../methods/processing';
import { FellBunch } from './methods/fellbunch';
import { Skidding } from './methods/skidding';

function GroundManualWT(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary =
    assumption.ResidueRecovFracWT * intermediate.ResidueCT;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = input.CalcResidues
    ? assumption.ResidueRecovFracWT * intermediate.ResidueSLT
    : 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const FellwtSmallLogOtherResults = FellwtSmallLogOther(
    input,
    intermediate,
    machineCost
  );
  const CostManFLBLLT2 = FellwtSmallLogOtherResults.CostManFLBLLT2;
  const CostManFellST2 = FellwtSmallLogOtherResults.CostManFellST2;
  const SkiddingResults = Skidding(
    input,
    intermediate,
    machineCost,
    TreesPerCycleIIB
  );
  const CostSkidUB = SkiddingResults.CostSkidUB;
  const ProcessingResults = Processing(input, intermediate, machineCost);
  const CostProcess = ProcessingResults.CostProcess;
  const LoadingResults = Loading(assumption, input, intermediate, machineCost);
  const CostLoad = LoadingResults.CostLoad;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipLooseRes = ChippingResults.CostChipLooseRes;

  const GalChainsaw = 0.0104 * 2.83168 * 0.264172; // 0.0104 L/m3 => gal/CCF
  const GalSkidUB = SkiddingResults.GalSkidUB;
  const GalProcess = ProcessingResults.GalProcess;
  const GalLoad = LoadingResults.GalLoad;
  const GalChipWT = ChippingResults.GalChipWT;
  const GalChipLooseRes = ChippingResults.GalChipLooseRes;

  // C. For All Products, $/ac
  const ManualFellLimbBuckTreesLarger80cf =
    (CostManFLBLLT2 * intermediate.VolPerAcreLLT) / 100;
  const ManualFellTreesLess80cf =
    (CostManFellST2 * intermediate.VolPerAcreST) / 100;
  const SkidUnbunchedAllTrees = (CostSkidUB * intermediate.VolPerAcre) / 100;
  const ProcessLogTreesLess80cf =
    (CostProcess * intermediate.VolPerAcreSLT) / 100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees =
    (CostChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckTreesLarger80cf +
    ManualFellTreesLess80cf +
    SkidUnbunchedAllTrees +
    (input.ChipAll === false ? ProcessLogTreesLess80cf + LoadLogTrees : 0) +
    ChipWholeTrees;
  const Stump2Truck4ResiduesWithoutMovein =
    ChipWholeTrees +
    ManualFellTreesLess80cf *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWtST + intermediate.ResidueST)) +
    SkidUnbunchedAllTrees *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue));
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmanualWT * BoleVolCCF
    : 0;

  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf; // for Mech WT sys;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // D. For All Products, gal/ac
  const ManualFellLimbBuckTreesLarger80cf2 =
    (GalChainsaw * intermediate.VolPerAcreLLT) / 100;
  const ManualFellTreesLess80cf2 =
    (GalChainsaw * intermediate.VolPerAcreST) / 100;
  const SkidUnbunchedAllTrees2 = (GalSkidUB * intermediate.VolPerAcre) / 100;
  const ProcessLogTreesLess80cf2 =
    (GalProcess * intermediate.VolPerAcreSLT) / 100;
  const LoadLogTrees2 = (GalLoad * intermediate.VolPerAcreALT) / 100;
  const ChipWholeTrees2 =
    (GalChipWT *
      (input.ChipAll === false
        ? intermediate.VolPerAcreCT
        : intermediate.VolPerAcre)) /
    100;

  const DieselStump2Truck4PrimaryProductWithoutMovein =
    SkidUnbunchedAllTrees2 +
    (input.ChipAll === false ? ProcessLogTreesLess80cf2 + LoadLogTrees2 : 0) +
    ChipWholeTrees2;
  const DieselStump2Truck4ResiduesWithoutMovein =
    SkidUnbunchedAllTrees2 *
      ((intermediate.BoleWtCT + intermediate.ResidueCT) /
        (intermediate.BoleWt + intermediate.Residue)) +
    ChipWholeTrees2;
  const GasolineStump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckTreesLarger80cf2 + ManualFellTreesLess80cf2;
  const GasolineStump2Truck4ResiduesWithoutMovein =
    ManualFellTreesLess80cf2 *
    ((intermediate.BoleWtCT + intermediate.ResidueCT) /
      (intermediate.BoleWtST + intermediate.ResidueST));
  const LowboyLoads = 4;
  const mpg = 6;
  const Movein4PrimaryProduct2 = input.CalcMoveIn
    ? (LowboyLoads * input.MoveInDist) / mpg / input.Area
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf2 = input.CalcResidues
    ? GalChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein2 = ChipLooseResiduesFromLogTreesLess80cf2;

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
    GasolinePerAcre: 0,
    JetFuelPerAcre: 0,
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
  Total.GasolinePerAcre = GasolineStump2Truck4PrimaryProductWithoutMovein;
  Total.GasolinePerBoleCCF = Total.GasolinePerAcre / BoleVolCCF;

  // System Summaries - Residue
  // Cost
  Residue.WeightPerAcre =
    ResidueRecoveredOptional + intermediate.BoleWtCT + ResidueRecoveredPrimary;
  Residue.CostPerAcre =
    Stump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein;
  Residue.CostPerBoleCCF = Residue.CostPerAcre / BoleVolCCF;
  Residue.CostPerGT = Residue.CostPerAcre / Total.WeightPerAcre;
  // Fuel
  Residue.DieselPerAcre =
    DieselStump2Truck4ResiduesWithoutMovein + OntoTruck4ResiduesWoMovein2;
  Residue.GasolinePerAcre = GasolineStump2Truck4ResiduesWithoutMovein;

  if (input.ChipAll) {
    Residue = Total;
  }

  return {
    Total,
    Residue,
  };
}

export { GroundManualWT };
