nvm use v16.19.1 
npx locklift run -s ./scripts/1-deploy-goldfish.ts -n venom_testnet

# 0:c86416d9fd44ae25c3432eae9efee2be36209791db4603fa084c7d446f629bfb

mv /home/waheed/venom/GoldFishFinance/goldfish-front-end/src/abi/GoldFish.abi.json GoldFish.abi.json-1
cp /home/waheed/venom/GoldFishFinance/build/GoldFish.abi.json /home/waheed/venom/GoldFishFinance/goldfish-front-end/src/abi
echo "Copied"