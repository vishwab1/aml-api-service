#!/bin/bash
fileName=$1
if [ "$fileName" == "" ]; then
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  printf "${RED}ERROR!${NC} File name is Required!\n"
  exit
fi
echo "New migration created."
cat >./src/migrations/$(date +"%Y%m%d%H%M%S")-$fileName.ts <<EOF
import { QueryInterface, DataTypes } from 'sequelize';

export = {
    /**
     * Write code here for migration.
     *
     * @param queryInterface
     */
    up: async (queryInterface: QueryInterface) => {
        //
    },

    /**
     * Write code here for migration rollback.
     *
     * @param queryInterface
     */
    down: async (queryInterface: QueryInterface) => {
        //
    }
};
EOF
