// Outputs sheet: Cable Manual Log column
import { Chipping } from '../chipping';
import { AssumptionMod, InputVarMod, IntermediateVarMod, MachineCostMod } from '../frcs.model';
import { FellAllTrees } from '../ground/fellalltrees';
import { InLimits } from '../inlimits';
import { Loading } from '../loading';
import { MachineCosts } from '../machinecosts';
import { MoveInCosts } from '../moveincost';
import { CYCCU } from './cyccu';
import { CYPCU } from './cypcu';

function CableManualLog(input: InputVarMod, intermediate: IntermediateVarMod, assumption: AssumptionMod) {
// ----System Product Summary--------------
    // Amounts Recovered Per Acre
    const BoleVolCCF = intermediate.VolPerAcre / 100;
    const ResidueRecoveredPrimary = 0;
    const PrimaryProduct = intermediate.BoleWt + ResidueRecoveredPrimary;
    const ResidueRecoveredOptional = 0;
    const TotalPrimaryProductsAndOptionalResidues = PrimaryProduct + ResidueRecoveredOptional;

// Limits
    const InLimits1 = InLimits(input, intermediate);
// Machine costs
    const machineCost: MachineCostMod = MachineCosts();
// System Cost Elements-------
    const FellAllTreesResults = FellAllTrees(input, intermediate, machineCost);
    const CostManFLB = FellAllTreesResults.CostManFLB;
    const CostYardPCUB = CYPCU(assumption, input, intermediate, machineCost);
    const CostYardCCUB = CYCCU(input, intermediate, machineCost);
    const LoadingResults = Loading(assumption, input, intermediate, machineCost);
    const CostLoad = LoadingResults.CostLoad;
    const ChippingResults = Chipping(assumption, input, intermediate, machineCost);
    const CostChipWT = ChippingResults.CostChipWT;
    const MoveInCostsResults = MoveInCosts(input, intermediate, machineCost);
    const CostChipLooseRes = ChippingResults.CostChipLooseRes;

    // C. For All Products, $/ac
    const ManualFellLimbBuckAllTrees = CostManFLB * intermediate.VolPerAcre / 100 * InLimits1;
    const YardUnbunchedAllTrees = (input.cut_type === true ?
        CostYardPCUB : (input.cut_type === false ? CostYardCCUB : 0)) * intermediate.VolPerAcre / 100 * InLimits1;
    const LoadLogTrees = CostLoad * intermediate.VolPerAcreALT / 100 * InLimits1;
    const ChipWholeTrees = CostChipWT * intermediate.VolPerAcreCT / 100 * InLimits1;

    const Stump2Truck4PrimaryProductWithoutMovein = ManualFellLimbBuckAllTrees
        + YardUnbunchedAllTrees + LoadLogTrees + ChipWholeTrees;
    const Movein4PrimaryProduct = input.CalcMoveIn ?
        MoveInCostsResults.CostPerCCFcableManualLog * BoleVolCCF * InLimits1 : 0;
    const ChipLooseResiduesFromLogTreesLess80cf = input.CalcResidues ?
        CostChipLooseRes * ResidueRecoveredOptional * InLimits1 : 0;
    const OntoTruck4ResiduesWoMovein = ChipLooseResiduesFromLogTreesLess80cf;
    const  Movein4Residues = (input.CalcMoveIn && input.CalcResidues) ?
        0 * ResidueRecoveredOptional * InLimits1 : 0;

// III. System Cost Summaries
    const TotalPerAcre = Math.round(Stump2Truck4PrimaryProductWithoutMovein + Movein4PrimaryProduct
        + OntoTruck4ResiduesWoMovein + Movein4Residues);
    const TotalPerBoleCCF = Math.round(TotalPerAcre / BoleVolCCF);
    const TotalPerGT = Math.round(TotalPerAcre / TotalPrimaryProductsAndOptionalResidues);

    return { 'TotalPerBoleCCF': TotalPerBoleCCF, 'TotalPerGT': TotalPerGT, 'TotalPerAcre': TotalPerAcre };
}

export { CableManualLog };