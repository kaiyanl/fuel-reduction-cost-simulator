// Outputs sheet: Ground-Based Manual Log column
import {
  AssumptionMod,
  InputVarMod,
  IntermediateVarMod,
  MachineCostMod
} from '../frcs.model';
import { Chipping } from '../methods/chipping';
import { FellAllTrees } from '../methods/fellalltrees';
import { Loading } from '../methods/loading';
import { MachineCosts } from '../methods/machinecosts';
import { MoveInCosts } from '../methods/moveincost';
import { FellBunch } from './methods/fellbunch';
import { Skidding } from './methods/skidding';

function GroundManualLog(
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
  const FellBunchResults = FellBunch(input, intermediate, machineCost);
  const TreesPerCycleIIB = FellBunchResults.TreesPerCycleIIB;
  const SkiddingResults = Skidding(
    input,
    intermediate,
    machineCost,
    TreesPerCycleIIB
  );
  const CostSkidUB = SkiddingResults.CostSkidUB;
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

  const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
  const CostManFLB = FellAllTreesResults.CostManFLB;

  // C. For All Products, $/ac
  const ManualFellLimbBuckAllTrees =
    (CostManFLB * intermediate.VolPerAcre) / 100;
  const SkidUnbunchedAllTrees = (CostSkidUB * intermediate.VolPerAcre) / 100;
  const LoadLogTrees = (CostLoad * intermediate.VolPerAcreALT) / 100;
  const ChipTreeBoles = (CostChipWT * intermediate.VolPerAcreCT) / 100;

  const Stump2Truck4PrimaryProductWithoutMovein =
    ManualFellLimbBuckAllTrees +
    SkidUnbunchedAllTrees +
    LoadLogTrees +
    ChipTreeBoles;
  const Movein4PrimaryProduct = input.CalcMoveIn
    ? MoveInCostsResults.CostPerCCFmanualLog * BoleVolCCF
    : 0;

  // III.0 Residue Cost Summaries
  const Residue = {
    ResidueWt: 0,
    ResiduePerGT: 0,
    ResiduePerAcre: 0
  };
  Residue.ResidueWt = intermediate.BoleWtCT + intermediate.ResidueCT;
  Residue.ResiduePerAcre =
    ChipTreeBoles +
    (ManualFellLimbBuckAllTrees + SkidUnbunchedAllTrees) *
      (intermediate.BoleWtCT / intermediate.BoleWt);
  Residue.ResiduePerGT = Residue.ResiduePerAcre / Residue.ResidueWt;

  Residue.ResidueWt = Math.round(Residue.ResidueWt);
  Residue.ResiduePerAcre = Math.round(Residue.ResiduePerAcre);
  Residue.ResiduePerGT = Math.round(Residue.ResiduePerGT);

  // III. System Cost Summaries
  const TotalPerAcre =
    Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct;
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

export { GroundManualLog };
