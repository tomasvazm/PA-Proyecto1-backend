import * as bcrypt from 'bcrypt';
import dataSource from '../orm.config';
import { Rol } from '../src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { Usuario } from '../src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

const ADMIN_ROLE = 'Administrador';

async function bootstrapAdmin(): Promise<void> {
  if (process.env.BOOTSTRAP_ADMIN_CONFIRM !== 'remote') {
    throw new Error(
      'Para evitar modificar la base equivocada, define BOOTSTRAP_ADMIN_CONFIRM=remote.',
    );
  }

  if (
    !process.env.DB_HOST ||
    ['localhost', '127.0.0.1', '::1'].includes(process.env.DB_HOST) ||
    process.env.DB_DATABASE === 'proyecto'
  ) {
    throw new Error(
      'El bootstrap remoto requiere una base de datos distinta de la configuración local.',
    );
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error('Falta la variable de entorno SEED_ADMIN_EMAIL.');
  }

  if (!adminPassword) {
    throw new Error('Falta la variable de entorno SEED_ADMIN_PASSWORD.');
  }

  await dataSource.initialize();

  try {
    const roleRepository = dataSource.getRepository(Rol);
    const userRepository = dataSource.getRepository(Usuario);

    let adminRole = await roleRepository.findOneBy({
      denominacion: ADMIN_ROLE,
    });

    if (!adminRole) {
      adminRole = await roleRepository.save(
        roleRepository.create({ denominacion: ADMIN_ROLE }),
      );
      console.log(`Rol "${ADMIN_ROLE}" creado.`);
    } else {
      console.log(`Rol "${ADMIN_ROLE}" ya existe.`);
    }

    const existingAdmin = await userRepository.findOne({
      where: { mail: adminEmail },
      relations: { roles: true },
    });

    if (existingAdmin) {
      console.log(`Usuario "${adminEmail}" ya existe.`);
      return;
    }

    const adminUser = userRepository.create({
      mail: adminEmail,
      contrasena: await bcrypt.hash(adminPassword, 10),
      denominacion: ADMIN_ROLE,
      roles: [adminRole],
    });

    await userRepository.save(adminUser);
    console.log(`Usuario "${adminEmail}" creado con rol "${ADMIN_ROLE}".`);
  } finally {
    await dataSource.destroy();
  }
}

bootstrapAdmin().catch((error: unknown) => {
  console.error(
    'No fue posible crear el administrador inicial:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
