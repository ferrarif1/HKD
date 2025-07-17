use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
};
use std::str::FromStr;

// 指定 deployer 地址和 mint 地址，作为合约权限控制者和代币绑定对象
const DEPLOYER_AUTHORITY: &str = "3fD8rhZnzXQbS7wU7baoLhBXBcMNUS1fgRsSb2Y7J6aK";
const HKDS_MINT: &str = "38X3qPmo4mmPWNLi5ndRiw9e5iLpYQqjD23AYtEHkKXf";

#[derive(Debug)]
pub enum StablecoinInstruction {
    ManualMint { amount: u64 },
    TransferToUser { amount: u64 },
    BurnFromUser { amount: u64 },
    AddToBlacklist,
    RemoveFromBlacklist,
}

impl StablecoinInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match tag {
            0 => Self::ManualMint {
                amount: u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                ),
            },
            1 => Self::TransferToUser {
                amount: u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                ),
            },
            2 => Self::BurnFromUser {
                amount: u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                ),
            },
            3 => Self::AddToBlacklist,
            4 => Self::RemoveFromBlacklist,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}

entrypoint!(process_instruction);
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = StablecoinInstruction::unpack(instruction_data)?;
    let account_info_iter = &mut accounts.iter();

    let authority = next_account_info(account_info_iter)?;
    let expected_authority =
        Pubkey::from_str(DEPLOYER_AUTHORITY).map_err(|_| ProgramError::InvalidArgument)?;
    if authority.key != &expected_authority {
        msg!("Unauthorized authority");
        return Err(ProgramError::InvalidAccountData);
    }

    match instruction {
        StablecoinInstruction::ManualMint { amount } => {
            let mint_account = next_account_info(account_info_iter)?;
            let token_program = next_account_info(account_info_iter)?;
            let user_account = next_account_info(account_info_iter)?;

            let expected_mint =
                Pubkey::from_str(HKDS_MINT).map_err(|_| ProgramError::InvalidArgument)?;
            if mint_account.key != &expected_mint {
                msg!("Invalid mint address");
                return Err(ProgramError::InvalidArgument);
            }

            msg!("Minting {} HKDS to regulator", amount);
            let ix = spl_token::instruction::mint_to(
                token_program.key,
                mint_account.key,
                user_account.key,
                authority.key,
                &[],
                amount,
            )?;
            invoke(
                &ix,
                &[
                    mint_account.clone(),
                    user_account.clone(),
                    authority.clone(),
                    token_program.clone(),
                ],
            )?;
        }
        StablecoinInstruction::TransferToUser { amount } => {
            let mint_account = next_account_info(account_info_iter)?;
            let token_program = next_account_info(account_info_iter)?;
            let user_account = next_account_info(account_info_iter)?;
            let to_user = next_account_info(account_info_iter)?;

            let expected_mint =
                Pubkey::from_str(HKDS_MINT).map_err(|_| ProgramError::InvalidArgument)?;
            if mint_account.key != &expected_mint {
                msg!("Invalid mint address");
                return Err(ProgramError::InvalidArgument);
            }

            msg!("Transfer {} HKDS from regulator to user", amount);
            let ix = spl_token::instruction::transfer(
                token_program.key,
                user_account.key,
                to_user.key,
                authority.key,
                &[],
                amount,
            )?;
            invoke(
                &ix,
                &[
                    user_account.clone(),
                    to_user.clone(),
                    authority.clone(),
                    token_program.clone(),
                ],
            )?;
        }
        StablecoinInstruction::BurnFromUser { amount } => {
            let user_token_account = next_account_info(account_info_iter)?;
            let token_program = next_account_info(account_info_iter)?;
            let mint_account = next_account_info(account_info_iter)?;

            let expected_mint =
                Pubkey::from_str(HKDS_MINT).map_err(|_| ProgramError::InvalidArgument)?;
            if mint_account.key != &expected_mint {
                msg!("Invalid mint address");
                return Err(ProgramError::InvalidArgument);
            }

            if user_token_account.owner != &spl_token::ID {
                msg!("Invalid token account owner");
                return Err(ProgramError::InvalidAccountData);
            }

            msg!("Burning {} HKDS from user", amount);
            let ix = spl_token::instruction::burn(
                token_program.key,
                user_token_account.key,
                mint_account.key,
                authority.key,
                &[],
                amount,
            )?;
            invoke(
                &ix,
                &[
                    user_token_account.clone(),
                    mint_account.clone(),
                    authority.clone(),
                    token_program.clone(),
                ],
            )?;
        }
        StablecoinInstruction::AddToBlacklist => {
            msg!("Adding user to blacklist (mock only)");
        }
        StablecoinInstruction::RemoveFromBlacklist => {
            msg!("Removing user from blacklist (mock only)");
        }
    }

    Ok(())
}
