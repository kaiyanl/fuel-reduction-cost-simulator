function MachineCosts() {
    const WageAndBenRateF = 44.44814821; // =FallBuckWage // hardcoded
    const WageAndBenRate = 35.25197962; // =OtherWage // hardcoded
    const interest = 0.08;
    const insuranceAtax = 0.07;
    const Diesel_fuel_price = 3.327; // hardcoded
    const smh = 1600;

    // Chainsaw
    const PurchasePriceChainsaw = 824.4620612; // hardcoded
    const HorsepowerChainsaw = 0;
    const LifeChainsaw = 1;
    const svChainsaw = 0.2;
    const utChainsaw = 0.5;
    const rmChainsaw = 7;
    const fcrChainsaw = 0;
    const loChainsaw = 0;
    const personsChainsaw = 0;
    const wbChainsaw = WageAndBenRateF;
    const Chainsaw = CostCalc(PurchasePriceChainsaw, HorsepowerChainsaw, LifeChainsaw, svChainsaw,
                              utChainsaw, rmChainsaw, fcrChainsaw, loChainsaw, wbChainsaw);
    const PMH_Chainsaw = Chainsaw[1];

    // FBuncher
    // FBuncher global
    const fcrFBuncher = 0.026;
    const loFBuncher = 0.37;
    const personsFBuncher = 1;
    const wbFBuncher = personsFBuncher * WageAndBenRate;
    // DriveToTree
    const PurchasePriceFBuncherDTT = 176670.4417; // hardcoded
    const HorsepowerFBuncherDTT = 150;
    const LifeFBuncherDTT = 3;
    const svFBuncherDTT = 0.2;
    const utFBuncherDTT = 0.65;
    const rmFBuncherDTT = 1;
    const DriveToTree = CostCalc(PurchasePriceFBuncherDTT, HorsepowerFBuncherDTT, LifeFBuncherDTT, svFBuncherDTT,
                                 utFBuncherDTT, rmFBuncherDTT, fcrFBuncher, loFBuncher, wbFBuncher);
    const PMH_DriveToTree = DriveToTree[1];
    // SwingBoom
    const PurchasePriceFBuncherSB = 365118.9128; // hardcoded
    const HorsepowerFBuncherSB = 200;
    const LifeFBuncherSB = 5;
    const svFBuncherSB = 0.15;
    const utFBuncherSB = 0.6;
    const rmFBuncherSB = 0.75;
    const SwingBoom = CostCalc(PurchasePriceFBuncherSB, HorsepowerFBuncherSB, LifeFBuncherSB, svFBuncherSB,
                               utFBuncherSB, rmFBuncherSB, fcrFBuncher, loFBuncher, wbFBuncher);
    const PMH_SwingBoom = SwingBoom[1];
    // SelfLeveling
    const HorsepowerFBuncherSL = 240;
    const SelfLeveling = CostCalc(PurchasePriceFBuncherSB, HorsepowerFBuncherSL, LifeFBuncherSB, svFBuncherSB,
                                  utFBuncherSB, rmFBuncherSB, fcrFBuncher, loFBuncher, wbFBuncher);
    const PMH_SelfLevel = SelfLeveling[1];

    const FB_OwnCost = (DriveToTree[0] + SwingBoom[0] + SelfLeveling[0]) / 3;

    // Harvester
    const LifeHarvester = 4;
    const svHarvester = 0.2;
    const utHarvester = 0.65;
    const rmHarvester = 1.1;
    const fcrHarvester = 0.029;
    const loHarvester = 0.37;
    const personsHarvester = 1;
    const wbHarvester = personsHarvester * WageAndBenRate;
    // Small
    const PurchasePriceHarvesterS = 412231.0306; // hardcoded
    const HorsepowerHarvesterS = 120;
    const HarvesterS = CostCalc(PurchasePriceHarvesterS, HorsepowerHarvesterS, LifeHarvester, svHarvester,
                                utHarvester, rmHarvester, fcrHarvester, loHarvester, wbHarvester);
    const PMH_HarvS = HarvesterS[1];
    // Big
    const PurchasePriceHarvesterB = 530011.325; // hardcoded
    const HorsepowerHarvesterB = 200;
    const HarvesterB = CostCalc(PurchasePriceHarvesterB, HorsepowerHarvesterB, LifeHarvester, svHarvester,
                                utHarvester, rmHarvester, fcrHarvester, loHarvester, wbHarvester);
    const PMH_HarvB = HarvesterB[1];

    const Harvester_OwnCost = (HarvesterS[0] + HarvesterB[0]) / 2;

    // Skidder global
    const svSkidder = 0.2;
    const utSkidder = 0.65;
    const rmSkidder = 0.9;
    const fcrSkidder = 0.028;
    const loSkidder = 0.37;
    const personsSkidder = 1;
    const wbSkidder = personsSkidder * WageAndBenRate;
    // Small
    const PurchasePriceSkidderS = 164892.4122; // hardcoded
    const HorsepowerSkidderS = 120;
    const LifeSkidderS = 5;
    const SkidderS = CostCalc(PurchasePriceSkidderS, HorsepowerSkidderS, LifeSkidderS, svSkidder,
                              utSkidder, rmSkidder, fcrSkidder, loSkidder, wbSkidder);
    const PMH_SkidderS = SkidderS[1];
    // Big
    const PurchasePriceSkidderB = 235560.5889; // hardcoded
    const HorsepowerSkidderB = 200;
    const LifeSkidderB = 4;
    const SkidderB = CostCalc(PurchasePriceSkidderB, HorsepowerSkidderB, LifeSkidderB, svSkidder,
                              utSkidder, rmSkidder, fcrSkidder, loSkidder, wbSkidder);
    const PMH_SkidderB = SkidderB[1];
    const Skidder_OwnCost = (SkidderS[0] + SkidderB[0]) / 2;

    // Forwarder
    const LifeForwarder = 4;
    const fcrForwarder = 0.025;
    const rmForwarder = 1;
    // Small
    const PurchasePriceForwarderS = 282672.7067; // hardcoded
    const HorsepowerForwarderS = 110;
    const svForwarderS = 0.25;
    // some vars have the same value as in Skidder, therefore keep those Skidder vars in the function below
    const ForwarderS = CostCalc(PurchasePriceForwarderS, HorsepowerForwarderS, LifeForwarder, svForwarderS,
                                utSkidder, rmForwarder, fcrForwarder, loSkidder, wbSkidder);
    const PMH_ForwarderS = ForwarderS[1];
    // Big
    const PurchasePriceForwarderB = 365118.9128; // hardcoded
    const HorsepowerForwarderB = 200;
    const svForwarderB = 0.2;
    const ForwarderB = CostCalc(PurchasePriceForwarderB, HorsepowerForwarderB, LifeForwarder, svForwarderB,
                                utSkidder, rmForwarder, fcrForwarder, loSkidder, wbSkidder);
    const PMH_ForwarderB = ForwarderB[1];
    const Forwarder_OwnCost = (ForwarderS[0] + ForwarderB[0]) / 2;

    // Yarder small
    const PurchasePriceYarderS = 188448.4711; // hardcoded
    const HorsepowerYarderS = 100;
    const LifeYarder = 10;
    const svYarder = 0.1;
    const utYarder = 0.75;
    const rmYarder = 1;
    const fcrYarder = 0.04;
    const loYarder = 0.1;
    const personsYarder = 5;
    const wbYarder = personsYarder * WageAndBenRate;
    const YarderS = CostCalc(PurchasePriceYarderS, HorsepowerYarderS, LifeYarder, svYarder,
                             utYarder, rmYarder, fcrYarder, loYarder, wbYarder);
    const PMH_YarderS = YarderS[1];
    // Yarder intermediate
    const PurchasePriceYarderI = 388674.9717; // hardcoded
    const HorsepowerYarderI = 200;
    const YarderI = CostCalc(PurchasePriceYarderI, HorsepowerYarderI, LifeYarder, svYarder,
                             utYarder, rmYarder, fcrYarder, loYarder, wbYarder);
    const PMH_YarderI = YarderI[1];
    const Yarder_OwnCost = (YarderS[0] + YarderI[0]) / 2;

    // Processor
    const LifeProcessor = 5;
    const svProcessor = 0.2;
    const utProcessor = 0.65;
    const rmProcessor = 1;
    const fcrProcessor = 0.022;
    const loProcessor = 0.37;
    const personsProcessor = 1;
    const wbProcessor = personsProcessor * WageAndBenRate;
    // Small
    const PurchasePriceProcessorS = 353340.8834; // hardcoded
    const HorsepowerProcessorS = 120;
    const ProcessorS = CostCalc(PurchasePriceProcessorS, HorsepowerProcessorS, LifeProcessor, svProcessor,
                                utProcessor, rmProcessor, fcrProcessor, loProcessor, wbProcessor);
    const PMH_ProcessorS = ProcessorS[1];
    // Big
    const PurchasePriceProcessorB = 471121.1778; // hardcoded
    const HorsepowerProcessorB = 200;
    const ProcessorB = CostCalc(PurchasePriceProcessorB, HorsepowerProcessorB, LifeProcessor, svProcessor,
                                utProcessor, rmProcessor, fcrProcessor, loProcessor, wbProcessor);
    const PMH_ProcessorB = ProcessorB[1];
    const Processor_OwnCost = (ProcessorS[0] + ProcessorB[0]) / 2;

    // Loader
    const LifeLoader = 5;
    const svLoader = 0.3;
    const utLoader = 0.65;
    const rmLoader = 0.9;
    const fcrLoader = 0.022;
    const loLoader = 0.37;
    const personsLoader = 1;
    const wbLoader = personsLoader * WageAndBenRate;
    // Small
    const PurchasePriceLoaderS = 223782.5595; // hardcoded
    const HorsepowerLoaderS = 120;
    const LoaderS = CostCalc(PurchasePriceLoaderS, HorsepowerLoaderS, LifeLoader, svLoader,
                             utLoader, rmLoader, fcrLoader, loLoader, wbLoader);
    const PMH_LoaderS = LoaderS[1];
    // Big
    const PurchasePriceLoaderB = 294450.7361; // hardcoded
    const HorsepowerLoaderB = 200;
    const LoaderB = CostCalc(PurchasePriceLoaderB, HorsepowerLoaderB, LifeLoader, svLoader,
                             utLoader, rmLoader, fcrLoader, loLoader, wbLoader);
    const PMH_LoaderB = LoaderB[1];
    const Loader_OwnCost = (LoaderS[0] + LoaderB[0]) / 2;

    // Chipper
    const LifeChipper = 5;
    const svChipper = 0.2;
    const utChipper = 0.75;
    const rmChipper = 1;
    const fcrChipper = 0.023;
    const loChipper = 0.37;
    const personsChipper = 1;
    const wbChipper = personsChipper * WageAndBenRate;
    // Small
    const PurchasePriceChipperS = 235560.5889; // hardcoded
    const HorsepowerChipperS = 350;
    const ChipperS = CostCalc(PurchasePriceChipperS, HorsepowerChipperS, LifeChipper, svChipper,
                              utChipper, rmChipper, fcrChipper, loChipper, wbChipper);
    const PMH_ChipperS = ChipperS[1];
    // Big
    const PurchasePriceChipperB = 353340.8834; // hardcoded
    const HorsepowerChipperB = 700;
    const ChipperB = CostCalc(PurchasePriceChipperB, HorsepowerChipperB, LifeChipper, svChipper,
                              utChipper, rmChipper, fcrChipper, loChipper, wbChipper);
    const PMH_ChipperB = ChipperB[1];
    const Chipper_OwnCost = (ChipperS[0] + ChipperB[0]) / 2;

    // Bundler
    const PurchasePriceBundler = 530011.325; // hardcoded
    const HorsepowerBundler = 180;
    const fcrBundler = 0.025;
    // the other vars are the same as Chipper's, therefore pass chipper vars in the function below
    const Bundler = CostCalc(PurchasePriceBundler, HorsepowerBundler, LifeChipper, svChipper,
                             utChipper, rmChipper, fcrBundler, loChipper, wbChipper);
    const PMH_Bundler = Bundler[1];
    const Bundler_OwnCost = Bundler[0];

    const resultObj = {'PMH_Chainsaw': PMH_Chainsaw, 'PMH_DriveToTree': PMH_DriveToTree, 'PMH_SwingBoom': PMH_SwingBoom,
                       'PMH_SelfLevel': PMH_SelfLevel, 'FB_OwnCost': FB_OwnCost, 'PMH_HarvS': PMH_HarvS,
                       'PMH_HarvB': PMH_HarvB, 'Harvester_OwnCost': Harvester_OwnCost, 'PMH_SkidderS': PMH_SkidderS,
                       'PMH_SkidderB': PMH_SkidderB, 'Skidder_OwnCost': Skidder_OwnCost,
                       'PMH_ForwarderS': PMH_ForwarderS, 'PMH_ForwarderB': PMH_ForwarderB,
                       'Forwarder_OwnCost': Forwarder_OwnCost, 'PMH_YarderS': PMH_YarderS, 'PMH_YarderI': PMH_YarderI,
                       'Yarder_OwnCost': Yarder_OwnCost, 'PMH_ProcessorS': PMH_ProcessorS,
                       'PMH_ProcessorB': PMH_ProcessorB, 'Processor_OwnCost': Processor_OwnCost,
                       'PMH_LoaderS': PMH_LoaderS, 'PMH_LoaderB': PMH_LoaderB, 'Loader_OwnCost': Loader_OwnCost,
                       'PMH_ChipperS': PMH_ChipperS, 'PMH_ChipperB': PMH_ChipperB, 'Chipper_OwnCost': Chipper_OwnCost,
                       'PMH_Bundler': PMH_Bundler, 'Bundler_OwnCost': Bundler_OwnCost};
    // console.log(resultObj);
    return resultObj;

    function CostCalc(PurchasePriceYarder: number, HorsepowerYarder: number, Life: number,
                      sv: number, ut: number, rm: number, fcr: number,
                      lo: number, wb: number) {
        const SalvageYarderS = PurchasePriceYarder * sv;
        const AnnualDepreciationYarder = (PurchasePriceYarder - SalvageYarderS) / Life;
        const avgYearlyInvestmentYarder = (((PurchasePriceYarder - SalvageYarderS)
            * (Life + 1) / (2 * Life)) + SalvageYarderS);
        const PMHyarder = smh * ut;
        const InterestCostYarder = interest * avgYearlyInvestmentYarder;
        const InsuranceAndTaxCost = insuranceAtax * avgYearlyInvestmentYarder;
        const YearlyOwnershipCostYarder = InsuranceAndTaxCost + InterestCostYarder + AnnualDepreciationYarder;
        const OwnershipCostSMHyarder = YearlyOwnershipCostYarder / smh;
        const OwnershipCostPMHyarder = YearlyOwnershipCostYarder / PMHyarder;
        const FuelCostYarder = HorsepowerYarder * fcr * Diesel_fuel_price;
        const LubeCostYarder = lo * FuelCostYarder;
        const RepairAndMaintenanceCostYarder = AnnualDepreciationYarder * rm / PMHyarder;
        const LaborCostPMHyarder = wb / ut;
        const OperatingCostPMHyarder = FuelCostYarder + LubeCostYarder
            + RepairAndMaintenanceCostYarder + LaborCostPMHyarder;
        const OperatingCostSMHyarder = OperatingCostPMHyarder * ut;
        const TotalCostSMHyarder = OwnershipCostSMHyarder + OperatingCostSMHyarder;
        const TotalCostPMHyarderS = OwnershipCostPMHyarder + OperatingCostPMHyarder;

        return [OwnershipCostPMHyarder, TotalCostPMHyarderS];
    }
}

export { MachineCosts };
