import 'dotenv/config';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function main() {
  const region = requireEnv('AWS_REGION');

  const client = new STSClient({
    region,
    credentials: {
      accessKeyId: requireEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });

  const out = await client.send(new GetCallerIdentityCommand({}));
  // Safe to print: contains no secret access key.
  console.log(
    JSON.stringify(
      {
        Account: out.Account,
        Arn: out.Arn,
        UserId: out.UserId,
        Region: region,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err?.message ?? err);
  process.exitCode = 1;
});

