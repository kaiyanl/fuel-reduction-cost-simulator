// Outputs sheet: Helicopter Manual WT column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellAllTrees } from '../methods/fellalltrees';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { HelicopterYarding } from './methods/helicopteryarding';

function HelicopterManualWT(
  input: InputVarMod,
  intermediate: IntermediateVarMod,
  assumption: AssumptionMod
) {
  // ----System Product Summary--------------
  // Amounts Recovered Per Acre
  const BoleVolCCF = intermediate.VolPerAcre / 100;
  const ResidueRecoveredPrimary = 0;
  const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
  const ResidueRecoveredOptional = 0;
  const TotalPrimaryProductsAndOptionalResidues =
    PrimaryProduct + ResidueRecoveredOptional;

  // Machine costs
  const machineCost: MachineCostMod = MachineCosts(input);
  // System Cost Elements-------
  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const CostManFLB = FellAllTreesResults.CostManFLB;
  const HelicopterYardingResults = HelicopterYarding(input, intermediate);
  const CostHeliYardML = HelicopterYardingResults.CostHeliYardML;
  const CostHeliLoadML = HelicopterYardingResults.CostHeliLoadML;
  const ChippingResults = Chipping(
    assumption,
    input,
    intermediate,
    machineCost
  );
  const CostChipWT = ChippingResults.CostChipWT;
  const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
  const CostChipLooseRes = ChippingResults.CostChipLooseRes;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees =
    (CostManFLB * intermediate.VolPerAcre) / 100;
  const HeliYardUnbunchedAllTrees =
    (CostHeliYardML * intermediate.VolPerAcre) / 100;
  const LoadLogTrees = (CostHeliLoadML * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles = (CostChipWT * intermediate.VolPerAcreCT) / 100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    HeliYardUnbunchedAllTrees +
    LoadLogTrees +
    ChipTreeBoles;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFhManualLog * BoleVolCCF
    : 0;
  const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues
    ? CostChipLooseRes * ResidueRecoveredOptional
    : 0;
  const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
  const Movein4Residues =
    input.CalcMoveIn && input.CalcResidues ? 0 * ResidueRecoveredOptional : 0;

  // III.0 Residue Cost Summaries
  const Residue = {
    ResidueWt: 0,
    ResiduePerGT: 0,
    ResiduePerAcre: 0
  };
  Residue.ResidueWt = intermediate.BoleWtCT + intermediate.ResidueCT;
  Residue.ResiduePerAcre =
    ChipTreeBoles +
    (ManualFellLimbBuckAllTrees + HeliYardUnbunchedAllTrees) *
      (intermediate.BoleWtCT / intermediate.BoleWt);
  Residue.ResiduePerGT = Residue.ResiduePerAcre / Residue.ResidueWt;

  Residue.ResidueWt = Math.round(Residue.ResidueWt);
  Residue.ResiduePerAcre = Math.round(Residue.ResiduePerAcre);
  Residue.ResiduePerGT = Math.round(Residue.ResiduePerGT);

  // III. System Cost Summaries
  const TotalPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein +
    Movein4PrimaryProduct +
    OntoTruck4ResiduesWoMovein +
    Movein4Residues;
  const TotalPerBoleCCF = TotalPerAcre / BoleVolCCF;
  const TotalPerGT = TotalPerAcre / TotalPrimaryProductsAndOptionalResidues;

  const TotalPerAcreOut = Math.round(TotalPerAcre);
  const TotalPerBoleCCFout = Math.round(TotalPerBoleCCF);
  const TotalPerGTout = Math.round(TotalPerGT);

  return {
    TotalPerBoleCCF: TotalPerBoleCCFout,
    TotalPerGT: TotalPerGTout,
    TotalPerAcre: TotalPerAcreOut,
    Residue
  };
}

export { HelicopterManualWT };
